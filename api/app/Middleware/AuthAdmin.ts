import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.use('api').authenticate()

    if (user.roleId !== 1) {
      return response.status(403).send({ errors: [{ message: 'Unauthorized error' }] })
    }

    await next()
  }
}
