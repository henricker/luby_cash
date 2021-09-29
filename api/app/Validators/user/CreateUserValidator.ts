import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    fullName: schema.string(),
    email: schema.string({}, [rules.email(), rules.unique({ column: 'email', table: 'users' })]),
    cpfNumber: schema.string({}, [
      rules.cpf(),
      rules.unique({ table: 'users', column: 'cpf_number' }),
    ]),
    phone: schema.string({}, [rules.unique({ column: 'phone', table: 'users' })]),
    city: schema.string(),
    state: schema.string(),
    zipcode: schema.string(),
    address: schema.string(),
    averageSalary: schema.number(),
    password: schema.string({}, [
      rules.regex(
        new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ),
    ]),
  })

  public messages = {
    'required': '{{ field }} is required',
    'cpfNumber.unique': 'CPF already exists',
    'email.unique': 'email already exists',
  }
}
