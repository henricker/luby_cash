import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Status } from 'App/Models/enum/status'
import Pix from 'App/Models/Pix'
// import User from 'App/Models/User'
import PixValidator from 'App/Validators/PixValidator'

export default class PixesController {
  public async store({ auth, request, response }: HttpContextContract) {
    // const data = await request.validate(PixValidator)
    // const userIssuer = await auth.use('api').authenticate()

    // if (userIssuer.currentBalance < data.transfer_value)
    //   return response
    //     .status(400)
    //     .send({ errors: [{ message: 'the current balance is less than the transfer amount' }] })

    // if (!userIssuer.status === null || userIssuer.status === Status.DISAPPROVED)
    //   return response.status(400).send({
    //     errors: [{ message: 'Cannot transfer when sender has no status or is disapproved' }],
    //   })

    // const userRecipient = await User.findByOrFail('cpfNumber', data.cpf_recipient)

    // if (userRecipient.id === userIssuer.id)
    //   return response.status(400).send({ errors: [{ message: 'Unable to transfer to self' }] })

    // if (!userRecipient.status === null || userRecipient.status === Status.DISAPPROVED)
    //   return response.status(400).send({
    //     errors: [{ message: 'Cannot transfer when recipient has no status or is disapproved' }],
    //   })

    // userRecipient.currentBalance += data.transfer_value
    // userIssuer.currentBalance -= data.transfer_value

    // await userRecipient.save()
    // await userIssuer.save()

    // await Pix.create({
    //   transferValue: data.transfer_value,
    //   issuerUser: userIssuer.id,
    //   recipientUser: userRecipient.id,
    // })

    return response.status(201).send('Transfer successful')
  }

  public async index({ request, params, response }: HttpContextContract) {
    // const userId = params.userId

    // let { page, perPage } = request.qs()

    // //Add default values
    // page = !page || page <= 0 ? 1 : Number(page)
    // perPage = !perPage || perPage <= 0 ? 10 : Number(perPage)

    // //Case page or perPage are NaN add default values
    // page = Number.isNaN(page) ? 1 : page
    // perPage = Number.isNaN(perPage) ? 10 : perPage

    // const user = await User.findByOrFail('id', userId)

    // const pixesByUser = (
    //   await Pix.query()
    //     .where('recipient_user', userId)
    //     .orWhere('issuer_user', userId)
    //     .orderBy('id', 'desc')
    //     .preload('issuerUserModel')
    //     .preload('recipientUserModel')
    //     .paginate(page, perPage)
    // ).serialize()

    // const transfers = pixesByUser.data.map((pix) => ({
    //   transferId: pix.id,
    //   nameIssuer: pix.issuerUserModel.full_name,
    //   cpfIssuer: pix.issuerUserModel.cpf_number,
    //   nameRecipient: pix.recipientUserModel.full_name,
    //   cpfRecipient: pix.recipientUserModel.cpf_number,
    //   transferValue: pix.transfer_value,
    //   createdAt: pix.created_at,
    // }))

    // pixesByUser.data = [{ client: user.fullName, currentBalance: user.currentBalance, transfers }]

    // return response.send(pixesByUser)
    return response.status(200)
  }
}
