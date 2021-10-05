import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateAdminValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    full_name: schema.string(),
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        column: 'email',
        table: 'admins',
        whereNot: { id: this.ctx.params['adminId'] },
      }),
    ]),
  })

  public messages = {
    'required': '{{ field }} is required',
    'cpfNumber.unique': 'CPF already exists',
    'email.unique': 'email already exists',
  }
}
