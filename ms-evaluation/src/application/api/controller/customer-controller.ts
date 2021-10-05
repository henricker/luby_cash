import { Request, Response } from "express";
import Customer from "../../entity/customer";
import { CustomerRepository } from "../../repository/customer-repository";
import { CustomerService } from "../../services/customer-service";
import moment from 'moment'

const customerService = new CustomerService()

export default class CustomerController {

  public async index(request: Request, response: Response) {

    let { page, limit, status, begin_date, end_date } = request.query
    let pagination = Number(page)
    let limitation = Number(limit)
    begin_date = String(begin_date)
    end_date = String(end_date)

    pagination = !page || pagination <= 0 || Number.isNaN(pagination) ? 1 : pagination
    limitation = !limitation || limitation <= 0 || Number.isNaN(pagination) ? 10 : limitation
    status = status === 'approved' || status === 'disapproved' ? status : 'approved'

 
    begin_date = /\d\d\d\d-\d\d-\d\d/g.test(begin_date) ? begin_date + ' 00:00:00' : moment().format('yyyy-MM-DD 00:00:00 A')
    end_date = /\d\d\d\d-\d\d-\d\d/g.test(end_date) ? end_date + ' 23:59:59' : moment().format('yyyy-MM-DD hh:mm:ss A')


    const customers = await customerService.index(pagination, limitation, { status: status === 'approved' ? true : false }, { begin_date, end_date })
    

    const responseData = {
      meta: {
        current_page: pagination,
        per_page: limitation,
        customer_status: status,
        begin_date: begin_date,
        end_date: end_date,
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