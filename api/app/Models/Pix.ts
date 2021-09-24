import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

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
}
