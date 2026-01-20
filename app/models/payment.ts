import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
export default class Payment extends BaseModel {
  public static table ='payment'
   static connection = 'mysql'
  @column({ isPrimary: true })
  declare id: number
  @column({})
  declare userId :number
  @column({})
  declare productId :number
  @column({})
  declare amount :number
  @column({})
  declare status :boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(()=> User,{foreignKey : 'userId' })
  declare buyer : BelongsTo<typeof User>
  
}