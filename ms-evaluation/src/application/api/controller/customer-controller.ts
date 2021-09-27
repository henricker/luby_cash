import { Request, Response } from "express";
import { CustomerService } from "../../services/customer-service";

export default class CustomerController {
  constructor(private customerService: CustomerService = new CustomerService()) {}

  public async index(request: Request, response: Response) {
    const customers = await this.customerService.index()

    return response.status(200).send({ customers: customers })
  }
}