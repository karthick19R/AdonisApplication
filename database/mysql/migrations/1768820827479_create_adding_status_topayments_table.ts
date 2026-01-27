import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'payment'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('status')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName,(table) =>{
      table.dropColumn('status')
    })
  }
}