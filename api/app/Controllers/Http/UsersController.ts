import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Status } from 'App/Models/enum/status'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/user/CreateUserValidator'
import { DateTime } from 'luxon'

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    let { status, page, perPage, statusDate } = request.qs()

    //Add default values
    page = !page || page <= 0 ? 1 : Number(page)
    perPage = !perPage || perPage <= 0 ? 10 : Number(perPage)
    status = status === Status.APPROVED || status === Status.DISAPPROVED ? status : Status.APPROVED

    //Case page or perPage are NaN add default values
    page = Number.isNaN(page) ? 1 : page
    perPage = Number.isNaN(perPage) ? 10 : perPage

    // Case date is not given or is invalid, we return default paging values with status of approved users
    if (
      !statusDate ||
      !/((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(String(statusDate))
    )
      return (
        await User.query().where('role_id', 2).andWhere('status', status).paginate(page, perPage)
      ).serialize()

    //Case has parsing date
    const tomorrow = DateTime.fromJSDate(new Date(statusDate)).plus({ days: 2 }).toSQLDate()

    const usersByDate = await User.query()
      .where('status', status)
      .andWhere('status_date', '>=', statusDate)
      .andWhere('status_date', '<', tomorrow)
      .paginate(page, perPage)

    return response.send(usersByDate.serialize())
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)
    const user = await User.create({ roleId: 2, ...data, currentBalance: 0 })
    return response.status(201).send({ user: user.serialize() })
  }
}
