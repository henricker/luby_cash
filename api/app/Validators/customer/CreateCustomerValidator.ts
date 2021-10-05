import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    full_name: schema.string(),
    email: schema.string({}, [rules.email()]),
    cpf_number: schema.string({}, [rules.cpf()]),
    phone: schema.string({}),
    city: schema.string(),
    state: schema.string(),
    zipcode: schema.string(),
    address: schema.string(),
    average_salary: schema.number(),
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
