import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('name','fullName')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table)=>{
      table.renameColumn('fullName','name')
    })
  }
}