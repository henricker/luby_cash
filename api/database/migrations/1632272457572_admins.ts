import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.string('full_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()
      table.timestamp('remember_me_token_created_at').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
