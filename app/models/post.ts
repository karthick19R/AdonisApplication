import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import  User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column ()
  declare receiverid :number

  @column()
  declare senderid :number
  @column()
  declare content : string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'senderid' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(()=> User,{foreignKey:'receiverid'})
  declare receiver : BelongsTo<typeof User>

}