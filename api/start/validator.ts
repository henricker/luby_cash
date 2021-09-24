import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('cpf', (value, _, options) => {
  if (typeof value !== 'string') return

  if (!value.match(/[0-9]{11}/)) {
    options.errorReporter.report(
      options.pointer,
      'cpf',
      'CPF validation failed',
      options.arrayExpressionPointer
    )
  }
})
