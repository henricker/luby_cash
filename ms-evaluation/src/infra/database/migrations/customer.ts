import getClient from '../index'

class CreateUser {
  private tableName = 'customer'

  public async up() {
    const client = getClient()
    await client.connect()
    const query = `CREATE TABLE ${this.tableName} ( 
      id SERIAL PRIMARY KEY, 
      full_name VARCHAR NOT NULL,
      average_salary DECIMAL(8, 2) NOT NULL,
      email VARCHAR UNIQUE NOT NULL,
      phone VARCHAR NOT NULL,
      cpf_number VARCHAR(11)  UNIQUE NOT NULL,
      address VARCHAR NOT NULL,
      city VARCHAR NOT NULL,
      state VARCHAR NOT NULL,
      zipcode VARCHAR NOT NULL,
      current_balance DECIMAL(8, 2) NOT NULL,
      status BOOLEAN NOT NULL,
      password VARCHAR NOT NULL, 
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`
    await client.query(query)
    await client.end()
  }

  public async down() {
    const client = getClient()
    await client.connect()
    const query = `DROP TABLE ${this.tableName}`
    await client.query(query)
    await client.end()
  }
}

export default new CreateUser();

