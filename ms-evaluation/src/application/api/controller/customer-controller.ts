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
      const customer = new Customer({ ...data })
      customer.password = undefined
      customer.status = undefined
      customer.id = undefined
      customer.email = undefined
      customer.cpf_number = undefined
      const customerUpdated = await repository.update({ full_name: data.full_name }, data.id)

      customerUpdated.password = undefined
      return response.status(200).send({ customer: customerUpdated })
    } catch(err) {
      return response.status(400).send({ errors: [{ message: err.message }] })
    }
  }
}