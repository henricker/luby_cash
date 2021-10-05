import { Repository } from "./repository";
import getClient from '../../infra/database'
import Customer  from "../entity/customer";

export class CustomerRepository extends Repository<Customer> {
  public async findByEmail(email: string) {
    try {
      const client = getClient()
      await client.connect()
      const query = `SELECT * FROM customer WHERE email = $1`
      const values = [ email ]
      const result = await client.query(query, values)
      await client.end()
    
      const customer = result.rows[0] ? new Customer({ ...result.rows[0] }) : undefined
      return customer
    } catch(err) {
      throw new Error(err.message)
    }
  }

  public async findByCPF(cpf: string) {
    try {
      const cpf_number = cpf
      const client = getClient()
      await client.connect()
      const query = `SELECT * FROM customer WHERE cpf_number = $1`
      const values = [ cpf_number ]
      console.log(query)
      const result = await client.query(query, values)
      await client.end()
    
      const customer = result.rows[0] ? new Customer({ ...result.rows[0] }) : undefined
      return customer
    } catch(err) {
      throw new Error(err.message)
    }
  }
}