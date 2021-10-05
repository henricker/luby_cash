import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pixes extends BaseSchema {
  protected tableName = 'pixes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('cpf_issuer')
        .unsigned()
      table
        .integer('cpf_recipient')
        .unsigned()
      table.double('transfer_value').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
