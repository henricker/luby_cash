import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthCustomer {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    const authorizationJwt = request.header('Authorization')

    const type = authorizationJwt?.split(' ')[0]
    const token = authorizationJwt?.split(' ')[1]

    if (type !== 'Bearer' || !token) {
      console.log(token)
      throw new AuthenticationException('not authenticated', 'E_UNAUTHORIZED_ACCESS')
    }

    jwt.verify(token, Env.get('TOKEN_SECRET'), (error, result) => {
      if (error) return response.status(401).send({ errors: [{ message: error.message }] })
      auth['cpf_number'] = result!['cpf_number']
    })

    if (!auth['cpf_number']) return

    await next()
  }
}
