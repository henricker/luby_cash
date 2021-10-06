import { Request, Response } from "express";
import Customer from "../../entity/customer";
import { CustomerRepository } from "../../repository/customer-repository";
import { CustomerService } from "../../services/customer-service";
import moment from 'moment'

const customerService = new CustomerService()

export default class CustomerController {

  public async index(request: Request, response: Response) {

    let { page, limit, status, date } = request.query
    let pagination = Number(page)
    let limitation = Number(limit)
    date = String(date)

    pagination = !page || pagination <= 0 || Number.isNaN(pagination) ? 1 : pagination
    limitation = !limitation || limitation <= 0 || Number.isNaN(pagination) ? 10 : limitation
    status = status === 'approved' || status === 'disapproved' ? status : 'approved'

    date = /\d\d\d\d-\d\d-\d\d/g.test(date) ? date + ' 00:00:00' : undefined
    let endDate = date ? moment(date).format('yyyy-MM-DD 23:59:59') : undefined

    const customers = await customerService.index(pagination, limitation, { status: status === 'approved' ? true : false }, date ? { begin_date: date, end_date: endDate } : undefined)
    
    const responseData = {
      meta: {
        current_page: pagination,
        per_page: limitation,
        customer_status: status,
        date: date ? date : 'no provided',
        customer_status_default: 'approved',
        page_default: 1,
        per_page_default: 10
      },
      data: {
        customers: customers.map((customer) => {
          customer.password = undefined
          return customer
        })
      }
    }

    return response.status(200).send(responseData)
  }

  public async show(request: Request, response: Response) {
    const cpf = request.params.cpf

    try {
      const customer = await customerService.show(cpf)
      customer['password'] = undefined
      return response.send({ customer: customer })
    } catch(err) {
      return response.status(404).send({ errors: [ { message: err.message } ] })
    }
  }

  public async showByToken(request: Request, response: Response) {
    const token = request.body.token
    try {
      const customer = await customerService.showByToken(token)
      return response.send({ customer: customer })
    } catch(err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }

  public async showByEmail(request: Request, response: Response) {
    const email = request.body.email
    try {
      const customer = await customerService.showByEmail(email)
      return response.send({ customer: customer })
    } catch(err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }

  public async store(request: Request, response: Response) {
    try {
      const data = request.body
      const customer = await customerService.store({ ...data })
  
      return response.status(201).send({ customer: customer })
    } catch(err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }

  public async update(request: Request, response: Response) {
    try {
      const data = request.body
      const repository = new CustomerRepository()
      const customer: Partial<Customer> = { ...data }

      const customerUpdated = await repository.update({ ...customer  }, data.id)

      customerUpdated.password = undefined
      return response.status(200).send({ customer: customerUpdated })
    } catch(err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }
}