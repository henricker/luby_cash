import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/customer/CreateCustomerValidator'
import axios from 'axios'
import Producer from '../../../kafka/producer'

const MS_EVALUATION_ENDPOINT = 'http://localhost:3030'

export default class CustomerController {
  public async index({ request, response }: HttpContextContract) {
    try {
      let { status, page, perPage, beginDate, endDate } = request.qs()

      const requestAxios = await axios.get(
        `${MS_EVALUATION_ENDPOINT}/customers/?status=${status}&page=${page}&perPage=${perPage}&begin_date=${beginDate}&end_date=${endDate}`
      )
      let customers: any[] = requestAxios.data['data']['customers']
      let meta: any[] = requestAxios.data['meta']

      customers = customers.map((customer: { status: string }) => {
        customer.status = customer.status ? 'approved' : 'disapproved'
        return customer
      })

      return response.status(200).send({ meta, data: customers })
    } catch (err) {
      console.log(err)
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const cpf = request.params().cpf
      const requestAxios = await axios.get(`${MS_EVALUATION_ENDPOINT}/customers/${cpf}`)
      return response.status(200).send(requestAxios.data)
    } catch (err) {
      console.log(err.message)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)
    const producer = new Producer()

    await producer.connect()

    await producer.sendMessage(
      [
        {
          value: JSON.stringify({ ...data }),
        },
      ],
      'evaluation-event'
    )

    await producer.disconnect()

    return response.status(200).send({ message: 'Registration sent for evaluation' })
  }
}
