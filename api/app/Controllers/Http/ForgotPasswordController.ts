import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import Admin from 'App/Models/Admin'
import ForgotPasswordValidator from 'App/Validators/forgot-password/ForgotPasswordValidator'
import RecoveryPasswordValidator from 'App/Validators/forgot-password/RecoveryPasswordValidator'
import ForgotPasswordCustomerValidator from 'App/Validators/forgot-password/ForgotPasswordCustomerValidator'
import RecoveryPasswordCustomerValidator from 'App/Validators/forgot-password/RecoveryPasswordCustomerValidator'
import crypto from 'crypto'
import { DateTime } from 'luxon'
import moment from 'moment'
import Customer from 'App/Models/interfaces/customer'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import Producer from '../../../kafka/producer'

const MS_EVALUATION_ENDPOINT = Env.get('MS_EVALUATION_ENDPOINT')

export default class ForgotPasswordsController {
  public async storeAdmin({ request }: HttpContextContract) {
    const data = await request.validate(ForgotPasswordValidator)
    const admin = await Admin.findByOrFail('email', data.email)
    admin.rememberMeToken = crypto.randomBytes(12).toString('hex')
    admin.rememberMeTokenCreatedAt = DateTime.now()

    await admin.save()

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
    return 'password updated with successfully'
  }

  public async storeCustomer({ request, response }: HttpContextContract) {
    const data = await request.validate(ForgotPasswordCustomerValidator)

    try {
      const customer: Customer = (
        await axios.get(MS_EVALUATION_ENDPOINT + '/customers/email/', {
          data: {
            email: data.email,
          },
        })
      ).data['customer']

      customer.remember_me_token = crypto.randomBytes(12).toString('hex')
      customer.remember_me_token_created_at = new Date()

      await axios.put(MS_EVALUATION_ENDPOINT + `/customers`, {
        id: customer.id,
        remember_me_token_created_at: customer.remember_me_token_created_at,
        remember_me_token: customer.remember_me_token,
      })

      const producer = new Producer()

      await producer.connect()

      await producer.sendMessage(
        [
          {
            value: JSON.stringify({
              contact: {
                name: customer.full_name,
                email: customer.email,
                remember_me_token: customer.remember_me_token,
              },
              template: 'forgot-password',
            }),
          },
        ],
        'mailer-event'
      )

      await producer.disconnect()

      return 'Check the token in your email'
    } catch (err) {
      return response
        .status(err?.response?.status)
        .send({ errors: [{ message: err?.response?.data?.errors[0]?.message }] })
    }
  }

  public async updateCustomer({ request, response }: HttpContextContract) {
    const data = await request.validate(RecoveryPasswordCustomerValidator)

    const token = data.token
    const newPassword = await Hash.make(data.password)

    try {
      const customer: Customer = (
        await axios.get(MS_EVALUATION_ENDPOINT + '/customers/token/', {
          data: {
            token,
          },
        })
      ).data['customer']

      await axios.put(MS_EVALUATION_ENDPOINT + '/customers', {
        id: customer.id,
        password: newPassword,
        remember_me_token: null,
        remember_me_token_created_at: null,
      })

      return 'password updated with successfully!'
    } catch (err) {
      return response
        .status(err?.response?.status)
        .send({ errors: [{ message: err?.response?.data?.errors[0]?.message }] })
    }
  }
}
