import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('senderid').unsigned().alter()
      table.integer('receiverid').unsigned().alter()
    })
  }

  async down() {
    
  }
}