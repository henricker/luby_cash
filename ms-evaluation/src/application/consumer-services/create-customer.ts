import { EachMessagePayload } from "kafkajs";
import KafkaConsumerContract from "../../infra/kafka/consumer-contract";
import { CustomerService } from "../services/customer-service";
import Customer from "../entity/customer";

class CreateCustomerConsumerContract implements KafkaConsumerContract{

  constructor(private customerService: CustomerService = new CustomerService()) {}

  topic: string = 'evaluation-event'
  async handler({ message }: EachMessagePayload): Promise<void> {
    try {
      const payload: Customer = JSON.parse(message.value.toString())

      if (!payload.full_name || !payload.email || !payload.average_salary || !payload.cpf_number || !payload.phone || !payload.address || !payload.state || !payload.city || !payload.zipcode || !payload.password) {
        throw new Error('invalid payload')


      console.log('Message received: ' + message.value.toString() + ' timestamps:' + message.timestamp)
      this.customerService.store({ ...payload })
    } catch (err) {
      console.error('Error: ' + err.message)
    }
  }
}

const createCustomerConsumerContract = new CreateCustomerConsumerContract()
export default createCustomerConsumerContract