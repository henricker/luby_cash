import Producer from "../../infra/kafka/producer";
import Customer from "../entity/customer";
import { CustomerRepository } from "../repository/customer-repository";
import { dateFilter } from "../repository/repository";

interface ICreateCustomer {
  full_name: string
  email: string
  average_salary: number
  cpf_number: string
  phone: string
  city: string
  state: string
  zipcode: string
  address: string
  password: string
}

export class CustomerService {

  constructor(private customerRepository: CustomerRepository = new CustomerRepository()) {}

  public async store({ full_name, email, average_salary, phone, city, state, zipcode, address, cpf_number, password }: ICreateCustomer): Promise<Customer> {
    try {
      const status = this.evaluation(average_salary)
      const currentBalance = status ? 200 : 0
      const customer = await this.customerRepository.create({ full_name, phone, address, email, cpf_number, city, current_balance: currentBalance, state, zipcode, average_salary, status, created_at: new Date(), password })
  
      const producer = new Producer()
      await producer.connect()

      await producer.sendMessage(
        [
          {
            value: JSON.stringify({
              contact: {
                name: customer.full_name,
                email: customer.email,
              },
              template: 'welcome-user',
            }),
          },
        ],
        'mailer-event'
      )
  
      await producer.sendMessage(
        [
          {
            value: JSON.stringify({
              contact: {
                name: customer.full_name,
                email: customer.email,
                status: customer.status,
              },
              template: 'evaluation-user'
            })
          }
        ]
      , 'mailer-event')

      await producer.disconnect()
  
      customer.password = undefined
      return customer
    } catch(err) {
      console.log(err.message)
    }
  }

  public async index(page: number = 0, limit: number = 10, where?: Partial<Customer>, dates?: dateFilter | undefined) {
    const customers = await this.customerRepository.find({ page, limit }, where, dates)
    return customers
  }
 
  public async show(cpf: string) {
    const customer = await this.customerRepository.findBy({ fieldName: 'cpf_number', fieldValue: cpf })
    
    if(!customer)
      throw new Error('customer not found')

    return customer
  }

  public async showByEmail(email: string) {
    const customer = await this.customerRepository.findBy({ fieldName: 'email', fieldValue: email })

    if(!customer)
      throw new Error('customer not found')

    return customer
  }

  public async showByToken(token: string) {
    const customer = await this.customerRepository.findBy({ fieldName: 'remember_me_token', fieldValue: token })

    if(!customer)
      throw new Error('customer not found')

    return customer
  }


  private evaluation(averageSalary: number): boolean {
    return averageSalary < 500 ? false : true
  }
}
