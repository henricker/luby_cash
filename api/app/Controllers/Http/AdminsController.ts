import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import CreateAdminValidator from 'App/Validators/admin/CreateAdminValidator'
import UpdateAdminValidator from 'App/Validators/admin/UpdateAdminValidator'

export default class AdminsController {
  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateAdminValidator)
    const admin = await Admin.create({ ...data, roleId: 1 })
    return response.status(201).send({ admin })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const adminId = params['adminId']
    const admin = await Admin.query().where('id', adminId).andWhere('role_id', 1).firstOrFail()
    await admin.delete()
    return response.send({ message: 'admin deleted with success' })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const adminId = params['adminId']

    const data = await request.validate(UpdateAdminValidator)
    const admin = await Admin.query().where('id', adminId).andWhere('role_id', 1).firstOrFail()

    admin.merge({ ...data })
    await admin.save()
    return response.send({ message: 'admin updated with success' })
  }

  public async index({ request, response }: HttpContextContract) {
    const { page, perPage } = request.qs()

    const admins = await Admin.query()
      .where('roleId', 1)
      .paginate(page ?? 1, perPage ?? 10)

    const serialized = admins.serialize()

    serialized.data = admins.serialize().data.map((admin) => ({
      id: admin.id,
      full_name: admin.full_name,
      email: admin.email,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    }))
    return response.send(serialized)
  }
}
