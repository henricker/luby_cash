import { EachMessagePayload } from "kafkajs";
import KafkaConsumerContract from "../../infra/kafka/consumer-contract";
import { CustomerService } from "../services/customer-service";

//testing payload { "name": "henricker", "email": "henricker@email", "averageSalary": 500 }

class CreateCustomerConsumerContract implements KafkaConsumerContract{

  constructor(private customerService: CustomerService = new CustomerService()) {}

  topic: string = 'evaluation-event'
  async handler({message, topic, partition}: EachMessagePayload): Promise<void> {
    try {
      const payload = JSON.parse(message.value.toString())

      if(!payload.name || !payload.email || !payload.averageSalary)
        throw new Error('invalid payload')

      console.log('Message received: ' + message.value.toString() + ' timestamps:' + message.timestamp)
      this.customerService.store({ ...payload })
    } catch(err) {
      console.error('Error: ' + err.message)
    }
  }
}

const createCustomerConsumerContract = new CreateCustomerConsumerContract()
export default createCustomerConsumerContract