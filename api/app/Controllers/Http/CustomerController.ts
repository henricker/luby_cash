import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/customer/CreateCustomerValidator'
import axios from 'axios'
import Producer from '../../../kafka/producer'
import Env from '@ioc:Adonis/Core/Env'

const MS_EVALUATION_ENDPOINT = Env.get('MS_EVALUATION_ENDPOINT')

export default class CustomerController {
  public async index({ request, response }: HttpContextContract) {
    try {
      let { status, page, perPage, date } = request.qs()

      const requestAxios = await axios.get(
        `${MS_EVALUATION_ENDPOINT}/customers/?status=${status}&page=${page}&limit=${perPage}&date=${date}`
      )
      let customers: any[] = requestAxios.data['data']['customers']
      let meta: any[] = requestAxios.data['meta']

      customers = customers.map((customer: { status: string }) => {
        customer.status = customer.status ? 'approved' : 'disapproved'
        return customer
      })

      return response.status(200).send({ meta, data: customers })
    } catch (err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const cpf = request.params().cpf
      const requestAxios = await axios.get(`${MS_EVALUATION_ENDPOINT}/customers/${cpf}`)
      return response.status(200).send(requestAxios.data)
    } catch (err) {
      return response
        .status(err?.response?.status)
        .send({ errors: [{ message: err?.response?.data?.errors[0]?.message }] })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateUserValidator)
    const producer = new Producer()

    data.password = await Hash.make(data.password)
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
