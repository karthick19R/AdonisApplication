import { DateTime } from 'luxon'
import { BaseModel, column,computed } from '@adonisjs/lucid/orm'

export default class Group extends BaseModel {
    public static table = 'user_group'
  @column({ isPrimary: true })
  declare id: number
  public static cachedGetters = ['displayName']
  @column()
  declare group_name : string
  @computed()
  get displayName() {
    console.log('computed again...')
    return this.group_name.toUpperCase()
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}