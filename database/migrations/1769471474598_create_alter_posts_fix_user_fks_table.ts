import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AlterPostsFixUserFk extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // 1️⃣ Drop existing foreign keys (important)
      table.dropForeign(['senderid'])
      table.dropForeign(['receiverid'])

      // 2️⃣ Alter column types to match users.id (INT UNSIGNED)
      table.integer('senderid').unsigned().alter()
      table.integer('receiverid').unsigned().alter()

      // 3️⃣ Re-add foreign keys
      table
        .foreign('senderid')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .foreign('receiverid')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      // rollback to BIGINT if needed
      table.dropForeign(['senderid'])
      table.dropForeign(['receiverid'])

      table.bigInteger('senderid').unsigned().alter()
      table.bigInteger('receiverid').unsigned().alter()

      table
        .foreign('senderid')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .foreign('receiverid')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }
}
