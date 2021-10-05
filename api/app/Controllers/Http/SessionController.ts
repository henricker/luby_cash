import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SessionValidator from 'App/Validators/SessionValidator'

export default class SessionsController {
  public async storeAdmin({ request, auth, response }: HttpContextContract) {
    try {
      const data = await request.validate(SessionValidator)
      const token = await auth.use('api').attempt(data.email, data.password, {
        expiresIn: '1days',
      })
      return { jwt: token }
    } catch (err) {
      console.log(err.message)
      return response.status(400).send({ error: err.message })
    }
  }
}
