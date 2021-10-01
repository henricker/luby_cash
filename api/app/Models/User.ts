import { DateTime } from 'luxon'
import {
  afterCreate,
  BaseModel,
  beforeSave,
  beforeUpdate,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Hash from '@ioc:Adonis/Core/Hash'
import { Status } from './enum/status'
import Producer from '../../kafka/producer'

export default class User extends BaseModel {
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

  @column()
  public phone: string

  @column()
  public cpfNumber: string

  @column()
  public address: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public zipcode: string

  @column()
  public currentBalance: number

  @column()
  public averageSalary: number

  @column()
  public status: Status | null

  @column()
  public statusDate: DateTime | null

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
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterCreate()
  public static async evaluation(user: User) {
    if (process.env.NODE_ENV === 'testing' || user.$dirty.roleId === 1) return

    const producer = new Producer()

    await producer.connect()

    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            name: user.fullName,
            email: user.email,
            averageSalary: user.averageSalary,
          }),
        },
      ],
      'evaluation-event'
    )

    await producer.disconnect()
  }

  @afterCreate()
  public static async sendWelcomeMail(user: User) {
    if (process.env.NODE_ENV === 'testing' || user.$dirty.roleId === 1) return

    const producer = new Producer()
    await producer.connect()
    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            contact: {
              name: user.fullName,
              email: user.email,
            },
            template: 'welcome-user',
          }),
        },
      ],
      'mailer-event'
    )
    await producer.disconnect()
  }

  @beforeUpdate()
  public static async sendForgotPasswordMail(user: User) {
    if (!user.$dirty.rememberMeToken || process.env.NODE_ENV === 'testing') return
    const producer = new Producer()
    await producer.connect()
    await producer.sendMessage(
      [
        {
          value: JSON.stringify({
            contact: {
              name: user.fullName,
              email: user.email,
              remember_me_token: user.rememberMeToken,
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
