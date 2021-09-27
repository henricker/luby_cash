import express from 'express'
import routes from './routes'

class App {
  express: express.Express

  constructor() {
    this.express = express()
  }

  routes() {
    this.express.use(routes)
    return this
  }

  middlewares() {
    this.express.use(express.json())
    return this
  }
}

export default new App().middlewares().routes().express