import Router from 'express'
import customerRouter from './customer-router'
import sessionRouter from './session-router'
const routes = Router()
routes.use(customerRouter)
routes.use(sessionRouter)
export default routes