import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import ForgotPasswordValidator from 'App/Validators/forgot-password/ForgotPasswordValidator'
import RecoveryPasswordValidator from 'App/Validators/forgot-password/RecoveryPasswordValidator'
import crypto from 'crypto'
import { DateTime } from 'luxon'
import moment from 'moment'

export default class ForgotPasswordsController {
  public async storeAdmin({ request }: HttpContextContract) {
    const data = await request.validate(ForgotPasswordValidator)
    const user = await Admin.findByOrFail('email', data.email)

    user.rememberMeToken = crypto.randomBytes(12).toString('hex')
    user.rememberMeTokenCreatedAt = DateTime.now()

    await user.save()

    return 'Check the token in your email'
  }

  public async updateAdmin({ request, response }: HttpContextContract) {
    const { password, token } = await request.validate(RecoveryPasswordValidator)
    const admin = await Admin.findByOrFail('rememberMeToken', token)

    const tokenExpired = moment().subtract('2', 'days').isAfter(admin.rememberMeTokenCreatedAt)

    if (tokenExpired) return response.status(400).send({ errors: [{ message: 'token expired' }] })

    admin.rememberMeToken = null
    admin.rememberMeTokenCreatedAt = null
    admin.password = password

    await admin.save()
    return 'password updated successfully!'
  }
}
