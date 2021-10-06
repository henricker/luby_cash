import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'

const MS_EVALUATION_ENDPOINT = 'http://localhost:3030'

interface ResponseData {
  data: {
    customer: any
  }
}

export default class SessionsController {
  public async storeAdmin({ request, auth, response }: HttpContextContract) {
    try {
      const data = await request.validate(SessionValidator)
      const token = await auth.use('api').attempt(data.email, data.password, {
        expiresIn: '1days',
      })
      return { jwt: token }
    } catch (err) {
      return response.status(400).send({ error: err.message })
    }
  }

  public async storeCustomer({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(SessionValidator)

      const responseAxios: ResponseData = await axios.get(
        MS_EVALUATION_ENDPOINT + '/customers/email/',
        {
          data: {
            email: data.email,
          },
        }
      )

      const password: any = responseAxios.data?.customer.password
      const result = await Hash.verify(password, data.password)

      if (!result) return response.badRequest('invalid credentials')

      const token = jwt.sign(
        { cpf_number: responseAxios.data?.customer.cpf_number },
        Env.get('TOKEN_SECRET'),
        {
          expiresIn: '1day',
        }
      )

      return response.status(200).send({
        jwt: {
          type: 'bearer',
          token,
          expiresIn: DateTime.now().plus({ days: 1 }),
        },
      })
    } catch (err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }
}
