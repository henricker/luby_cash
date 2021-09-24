import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PixValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cpf_recipient: schema.string({}, [rules.cpf()]),
    transfer_value: schema.number([rules.unsigned()]),
  })

  public messages = {
    required: '{{ field }} is required',
  }
}
