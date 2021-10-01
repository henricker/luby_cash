import User from '../../app/Models/User'
import { EachMessagePayload } from 'kafkajs'
import { DateTime } from 'luxon'
import KafkaConsumerContract from '../../kafka/consumer-service-contract'
import { Status } from 'App/Models/enum/status'

class EvaluationCustomerConsumer implements KafkaConsumerContract {
  public topic: string = 'confirmation-evaluation-event'
  public async handler({ message }: EachMessagePayload): Promise<void> {
    try {
      if (!message.value) throw new Error('message value is invalid')

      const payload = JSON.parse(message.value.toString())
      const userPayload = payload.user

      if (userPayload.status === undefined || !userPayload.email || !userPayload.statusCreatedAt)
        throw new Error('invalid payload')

      console.log(
        'Message received: ' + message.value.toString() + ' timestamps:' + message.timestamp
      )

      const user = await User.findByOrFail('email', userPayload.email)
      user.merge({
        status: userPayload.status ? Status.APPROVED : Status.DISAPPROVED,
        statusDate: DateTime.fromJSDate(new Date(userPayload.statusCreatedAt)),
        currentBalance: userPayload.status ? 200 : 0,
      })

      await user.save()
    } catch (err) {
      console.error('Error: ' + err.message)
    }
  }
}

const createCustomerConsumerContract = new EvaluationCustomerConsumer()
export default createCustomerConsumerContract
