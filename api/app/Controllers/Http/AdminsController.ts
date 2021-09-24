import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AdminsController {
  public async promote({ params, response }: HttpContextContract) {
    const userId = params['userId']
    const user = await User.findByOrFail('id', userId)
    user.merge({ roleId: 1 })
    await user.save()
    return response.send(`User with id ${userId} has been promoted`)
  }

  public async demote({ params, response }: HttpContextContract) {
    const userId = params['userId']
    const user = await User.findByOrFail('id', userId)
    user.merge({ roleId: 2 })
    await user.save()
    return response.send(`User with id ${userId} has been demoted`)
  }

  public async index({ request, response }: HttpContextContract) {
    const { page, perPage } = request.qs()

    const admins = await User.query()
      .where('roleId', 1)
      .paginate(page ?? 1, perPage ?? 10)

    const serialized = admins.serialize()

    serialized.data = admins.serialize().data.map((admin) => ({
      id: admin.id,
      full_name: admin.full_name,
      email: admin.email,
      phone: admin.phone,
      cpf_number: admin.cpf_number,
      city: admin.city,
      state: admin.state,
      zipcode: admin.zipcode,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    }))
    return response.send(serialized)
  }
}
