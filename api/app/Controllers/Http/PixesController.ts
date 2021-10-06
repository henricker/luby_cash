import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PixValidator from 'App/Validators/PixValidator'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Pix from 'App/Models/Pix'
import Customer from '../../Models/interfaces/customer'

const MS_EVALUATION_ENDPOINT = Env.get('MS_EVALUATION_ENDPOINT')

export default class PixesController {
  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(PixValidator)

    const cpfIssuer = auth['cpf_number']
    const cpfRecipient = data.cpf_recipient
    const transferValue = data['transfer_value']

    try {
      const customerIssuer: Customer = (
        await axios.get(MS_EVALUATION_ENDPOINT + `/customers/${cpfIssuer}`)
      ).data['customer']

      const customerRecipient: Customer = (
        await axios.get(MS_EVALUATION_ENDPOINT + `/customers/${cpfRecipient}`)
      ).data['customer']

      if (!customerIssuer.status || !customerRecipient.status) {
        const err = new Error('cannot send or receive pix when customer has status disapproved')
        err['status'] = 400
        err['code'] = 'BUSSINESS_LOGIC_EXCEPTION'
        throw err
      }

      if (customerIssuer.current_balance < transferValue) {
        const err = new Error(
          'cannot send pix when the transfer value is greater than current_balance'
        )
        err['status'] = 400
        err['code'] = 'BUSSINESS_LOGIC_EXCEPTION'
        throw err
      }

      customerIssuer['current_balance'] =
        Number.parseInt(String(customerIssuer.current_balance)) - transferValue
      customerRecipient['current_balance'] =
        Number.parseInt(String(customerRecipient.current_balance)) + transferValue

      await axios.put(MS_EVALUATION_ENDPOINT + `/customers`, { ...customerIssuer })

      await axios.put(MS_EVALUATION_ENDPOINT + `/customers`, { ...customerRecipient })

      const pix = await Pix.create({
        cpfIssuer: customerIssuer.cpf_number,
        cpfRecipient: customerRecipient.cpf_number,
        transferValue,
      })

      return response.status(201).send({ message: 'Transfer successful', pix })
    } catch (err) {
      if (err.message === 'Request failed with status code 404')
        return response
          .status(err.response.status)
          .send({ errors: [{ message: err.response.data.errors[0].message }] })

      if (err?.code === 'BUSSINESS_LOGIC_EXCEPTION')
        return response.status(err.status).send({ errors: [{ message: err.message }] })
    }
  }

  public async index({ params, request, response }: HttpContextContract) {
    const customerCPF = params.customerCPF

    let { page, perPage, beginDate, endDate } = request.qs()

    //Add default values
    page = !page || page <= 0 ? 1 : Number(page)
    perPage = !perPage || perPage <= 0 ? 10 : Number(perPage)

    //Case page or perPage are NaN add default values
    page = Number.isNaN(page) ? 1 : page
    perPage = Number.isNaN(perPage) ? 10 : perPage

    try {
      const customer: Customer = (
        await axios.get(MS_EVALUATION_ENDPOINT + `/customers/${customerCPF}`)
      ).data['customer']

      if (
        !beginDate ||
        !endDate ||
        !/((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(beginDate) ||
        !/((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(endDate)
      ) {
        const pixesByUser = (
          await Pix.query()
            .where('cpf_issuer', customer.cpf_number)
            .orWhere('cpf_recipient', customer.cpf_number)
            .orderBy('id', 'desc')
            .paginate(page, perPage)
        ).serialize()

        return response.send(pixesByUser)
      }

      const pixesByUser = (
        await Pix.query()
          .where('created_at', '>', beginDate)
          .andWhere('cpf_issuer', customer.cpf_number)
          .orWhere('cpf_recipient', customer.cpf_number)
          // .andWhere('created_at', '<', endDate)
          .orderBy('id', 'desc')
          .paginate(page, perPage)
      ).serialize()

      return response.send(pixesByUser)
    } catch (err) {
      if (err.message === 'Request failed with status code 404')
        return response
          .status(err.response.status)
          .send({ errors: [{ message: err.response.data.errors[0].message }] })
    }
  }
}
