import { getCustomRepository } from "typeorm";
import { CustomerRepository } from "../repository/customer-repository";

interface ICreateCustomer {
  name: string
  email: string
  averageSalary: number
}

export class CustomerService {

  constructor(private customerRepository: CustomerRepository = getCustomRepository(CustomerRepository)) {}

  public async store({ name, email, averageSalary }: ICreateCustomer): Promise<void> {
    const status = this.evaluation(averageSalary)
    const customer = this.customerRepository.create({ name, email, averageSalary, status })
    await this.customerRepository.save(customer)
  }

  public async index(take: number = 10, skip: number = 1) {
    const customers = await this.customerRepository.find({ take, skip })
    return customers
  }

  private evaluation(averageSalary: number): boolean {
    return averageSalary < 500 ? false : true
  }
}