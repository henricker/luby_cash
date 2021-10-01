import { DateTime } from 'luxon'
import { afterCreate, BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Producer from '../../kafka/producer'

export default class Pix extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public issuerUser: number

  @column()
  public recipientUser: number

  @column()
  public transferValue: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'issuerUser',
  })
  public issuerUserModel: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'recipientUser',
  })
  public recipientUserModel: BelongsTo<typeof User>

  @afterCreate()
  public static async sendMailerToUsers(pix: Pix) {
    if (process.env.NODE_ENV === 'testing') return

    const issuerUser = await User.findByOrFail('id', pix.issuerUser)
    const recipientUser = await User.findByOrFail('id', pix.recipientUser)

    const producer = new Producer()

    await producer.connect()

    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            contact: {
              name: issuerUser.fullName,
              email: issuerUser.email,
              transferValue: pix.transferValue,
              currentBalance: issuerUser.currentBalance,
              recipientName: recipientUser.fullName,
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
              name: recipientUser.fullName,
              email: recipientUser.email,
              transferValue: pix.transferValue,
              currentBalance: recipientUser.currentBalance,
              issuerName: issuerUser.fullName,
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
