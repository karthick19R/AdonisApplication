import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('created_at', {useTz :true}).
      defaultTo(this.now()).alter()
    })
    this.schema.alterTable(this.tableName,(table) =>{
        table.timestamp('updated_at',{useTz:true}).defaultTo(this.now()).alter()
    })
  }

  async down() {
this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('created_at', {useTz :true}).alter()
    })
    this.schema.alterTable(this.tableName,(table) =>{
        table.timestamp('updated_at',{useTz:true}).alter()
    })
    }
}