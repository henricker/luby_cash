import Router from 'express'
import customerRouter from './customer-router'

const routes = Router()
routes.use(customerRouter)

export default routes