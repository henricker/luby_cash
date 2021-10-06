import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.exists({ table: 'admins', column: 'email' })]),
  })

  public messages = {
    'required': '{{ field }} is required',
    'email.email': 'email is invalid',
    'email.exists': 'email not found',
  }
}
