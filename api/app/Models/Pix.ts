import { DateTime } from 'luxon'
import { afterCreate, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Customer from './interfaces/customer'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Producer from '../../kafka/producer'

const MS_EVALUATION_ENDPOINT = Env.get('MS_EVALUATION_ENDPOINT')

export default class Pix extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cpfIssuer: string

  @column()
  public cpfRecipient: string

  @column()
  public transferValue: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async sendMailerToUsers(pix: Pix) {
    if (process.env.NODE_ENV === 'testing') return

    const issuerCustomer: Customer = (
      await axios.get(MS_EVALUATION_ENDPOINT + `/customers/${pix.cpfIssuer}`)
    ).data['customer']

    const recipientCustomer: Customer = (
      await axios.get(MS_EVALUATION_ENDPOINT + `/customers/${pix.cpfRecipient}`)
    ).data['customer']

    const producer = new Producer()
    await producer.connect()
    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            contact: {
              name: issuerCustomer.full_name,
              email: issuerCustomer.email,
              transferValue: pix.transferValue,
              currentBalance: issuerCustomer.current_balance,
              recipientName: recipientCustomer.full_name,
            },
            template: 'issuer-transfer',
          }),
        },
      ],
      'mailer-event'
    )

    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            contact: {
              name: recipientCustomer.full_name,
              email: recipientCustomer.email,
              transferValue: pix.transferValue,
              currentBalance: recipientCustomer.current_balance,
              issuerName: issuerCustomer.full_name,
            },
            template: 'recipient-transfer',
          }),
        },
      ],
      'mailer-event'
    )
    await producer.disconnect()
  }
}
