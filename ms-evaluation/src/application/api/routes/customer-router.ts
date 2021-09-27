import { Router } from "express";
import CustomerController from "../controller/customer-controller";
const customerRouter = Router()

const customerController = new CustomerController()

customerRouter.get('/', customerController.index)

export default customerRouter