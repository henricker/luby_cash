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
  remember_me_token?: string
  remember_me_token_created_at?: Date
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
  public remember_me_token?: string
  public remember_me_token_created_at?: Date
  
  constructor({ full_name, average_salary, cpf_number, email, status, id, created_at, current_balance, password, remember_me_token, remember_me_token_created_at }: ICreateCustomer) {
    this.full_name = full_name
    this.email = email
    this.average_salary = average_salary
    this.cpf_number = cpf_number
    this.current_balance = 0
    current_balance ? this.current_balance = current_balance : undefined
    created_at ? this.created_at = created_at : undefined
    remember_me_token ? this.remember_me_token = remember_me_token : undefined
    this.status = status
    id ? this.id = id : undefined
    this.password = password
  }
}