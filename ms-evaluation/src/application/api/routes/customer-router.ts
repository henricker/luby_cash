import { Router } from "express";
import CustomerController from "../controller/customer-controller";
const customerRouter = Router()

const customerController = new CustomerController()

customerRouter.get('/customers', customerController.index)
customerRouter.get('/customers/email/', customerController.showByEmail)
customerRouter.get('/customers/token', customerController.showByToken)
customerRouter.get('/customers/:cpf', customerController.show)
customerRouter.put('/customers', customerController.update)

export default customerRouter