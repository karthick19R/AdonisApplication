import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AlterPostsAddCascadeToUsers extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['senderid'])
      table.dropForeign(['receiverid'])

      table
        .bigInteger('senderid')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .alter()

      table
        .bigInteger('receiverid')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['senderid'])
      table.dropForeign(['receiverid'])

      table
        .bigInteger('senderid')
        .unsigned()
        .references('id')
        .inTable('users')
        .alter()

      table
        .bigInteger('receiverid')
        .unsigned()
        .references('id')
        .inTable('users')
        .alter()
    })
  }
}
