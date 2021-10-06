interface ICreateCustomer {
  full_name: string
  email: string
  average_salary: number
  current_balance?: number
  cpf_number: string
  status: boolean
  id?: number,
  created_at?: Date
  password: string
}

export default class Customer {

  public id?: number
  public full_name: string
  public email: string
  public average_salary: number
  public cpf_number: string
  public status: boolean
  public phone: string
  public address: string
  public city: string
  public state: string
  public zipcode: string
  public current_balance: number
  public created_at?: Date
  public password: string
  
  constructor({ full_name, average_salary, cpf_number, email, status, id, created_at, current_balance, password }: ICreateCustomer) {
    this.full_name = full_name
    this.email = email
    this.average_salary = average_salary
    this.cpf_number = cpf_number
    this.current_balance = 0
    current_balance ? this.current_balance = current_balance : ''
    created_at ? this.created_at = created_at : ''
    this.status = status
    id ? this.id = id : ''
    this.password = password
  }
}