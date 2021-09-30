import getClient from '../index'

class CreateUser {
  private tableName = 'customer'

  public async up() {
    const client = getClient()
    await client.connect()
    const query = `CREATE TABLE ${this.tableName} ( 
      id SERIAL PRIMARY KEY, 
      name VARCHAR NOT NULL,
      average_salary DECIMAL(8, 2) NOT NULL,
      email VARCHAR NOT NULL, 
      status BOOLEAN NOT NULL, 
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

//new CreateUser().down().then((value) => console.log('create table')).catch((err) => console.log(err.message))


