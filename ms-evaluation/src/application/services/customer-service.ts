import Customer from "../entity/customer";
import { CustomerRepository } from "../repository/customer-repository";

interface ICreateCustomer {
  name: string
  email: string
  averageSalary: number
}

export class CustomerService {

  constructor(private customerRepository: CustomerRepository = new CustomerRepository()) {}

  public async store({ name, email, averageSalary }: ICreateCustomer): Promise<Customer> {
    const status = this.evaluation(averageSalary)
    const customer = this.customerRepository.create({ name, email, average_salary: averageSalary, status, created_at: new Date() })
    return customer
  }

  public async index(page: number = 0, limit: number = 10) {
    const customers = await this.customerRepository.find({ page, limit })
    return customers
  }
 
  public async show(id: number) {
    const customer = await this.customerRepository.findById(id)
    
    if(!customer)
      throw new Error('customer not found')

    return customer
  }

  private evaluation(averageSalary: number): boolean {
    return averageSalary < 500 ? false : true
  }

}
