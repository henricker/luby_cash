export default interface Customer {
  full_name: string
  email: string
  average_salary: number
  cpf_number: string
  current_balance: number
  created_at: Date
  status: boolean
  id: number
  remember_me_token?: string
  remember_me_token_created_at?: Date
}
