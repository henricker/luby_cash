import { Request, Response } from "express";
import { CustomerService } from "../../services/customer-service";

const customerService = new CustomerService()

export default class CustomerController {

  public async index(request: Request, response: Response) {

    let { page, limit } = request.query
    let pagination = Number(page)
    let limitation = Number(limit)

    pagination = !page || pagination <= 0 || Number.isNaN(pagination) ? 1 : pagination
    limitation = !limitation || limitation <= 0 || Number.isNaN(pagination) ? 10 : limitation
    const customers = await customerService.index(pagination, limitation)

    return response.status(200).send({ customers: customers })
  }

  public async show(request: Request, response: Response) {
    const id = request.params.id

    try {
      const customer = await customerService.show(Number(id))
      return response.send({ customer: customer })
    } catch(err) {
      return response.status(404).send({ errors: [ { message: err.message } ] })
    }
  }

  public async store(request: Request, response: Response) {
    const data = request.body
    const customer = await customerService.store({ ...data })

    return response.status(201).send({ customer: customer })
  }
}