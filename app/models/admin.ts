import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import {v4 as uuid} from 'uuid'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'


const AuthFinder = withAuthFinder(
  () => hash.use('scrypt'),
  {
    uids: ['email'],
    passwordColumnName: 'password',
  }
)
export default class Admin extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fullName:string

  @column()
  declare email :string
  
  @column({serializeAs: null })
  declare password : string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

@beforeCreate()
public static assignuuid(admin:Admin) {
  admin.id = uuid()
}
}