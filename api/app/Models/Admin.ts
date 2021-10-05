import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  beforeUpdate,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Hash from '@ioc:Adonis/Core/Hash'
import Producer from '../../kafka/producer'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: number

  @column()
  public fullName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string | null

  @column({ serializeAs: null })
  public rememberMeTokenCreatedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @beforeSave()
  public static async hashPassword(admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await Hash.make(admin.password)
    }
  }

  @beforeUpdate()
  public static async sendForgotPasswordMail(admin: Admin) {
    if (!admin.$dirty.rememberMeToken || process.env.NODE_ENV === 'testing') return
    const producer = new Producer()
    await producer.connect()
    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            contact: {
              name: admin.fullName,
              email: admin.email,
              remember_me_token: admin.rememberMeToken,
            },
            template: 'forgot-password',
          }),
        },
      ],
      'mailer-event'
    )
    await producer.disconnect()
  }
}
