import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('fullName','full_name')
    })
  }

  async down() {
  this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('full_name','fullname')
    })
  }
}