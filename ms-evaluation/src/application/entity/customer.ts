interface ICreateCustomer {
  name: string
  email: string
  average_salary: number
  status: boolean
  id?: number,
  createdAt?: Date
}

export default class Customer {

  public id?: number
  public name: string
  public email: string
  public average_salary: number
  public status: boolean
  public created_at: Date
  
  constructor({ name, average_salary, email, status, id, createdAt }: ICreateCustomer) {
    this.name = name
    this.email = email
    this.average_salary = average_salary
    createdAt ? this.created_at = createdAt : this.created_at = new Date()
    this.status = status
    id ? this.id = id : ''
  }
}