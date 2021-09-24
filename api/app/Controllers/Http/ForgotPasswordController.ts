import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ForgotPasswordValidator from 'App/Validators/forgot-password/ForgotPasswordValidator'
import RecoveryPasswordValidator from 'App/Validators/forgot-password/RecoveryPasswordValidator'
import crypto from 'crypto'
import { DateTime } from 'luxon'
import moment from 'moment'

export default class ForgotPasswordsController {
  public async store({ request }: HttpContextContract) {
    const data = await request.validate(ForgotPasswordValidator)
    const user = await User.findByOrFail('email', data.email)

    user.rememberMeToken = crypto.randomBytes(12).toString('hex')
    user.rememberMeTokenCreatedAt = DateTime.now()

    await user.save()

    return 'Check the token in your email'
  }

  public async update({ request, response }: HttpContextContract) {
    const { password, token } = await request.validate(RecoveryPasswordValidator)
    const user = await User.findByOrFail('rememberMeToken', token)

    const tokenExpired = moment().subtract('2', 'days').isAfter(user.rememberMeTokenCreatedAt)

    if (tokenExpired) return response.status(400).send({ errors: [{ message: 'token expired' }] })

    user.rememberMeToken = null
    user.rememberMeTokenCreatedAt = null
    user.password = password

    await user.save()
    return 'password updated successfully!'
  }
}
