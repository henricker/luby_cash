import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Status } from 'App/Models/enum/status'

export default class Users extends BaseSchema {
  protected tableName = 'users'

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
      table.string('phone').notNullable().unique()
      table.string('cpf_number').notNullable().unique()
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('zipcode').notNullable()
      table.double('current_balance').notNullable()
      table.double('average_salary').notNullable()
      table.enum('status', Object.values(Status)).nullable()
      table.timestamp('status_date', { useTz: true }).nullable()
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
