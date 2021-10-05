import express from 'express'
import routes from './routes'
import cors, { CorsOptions } from 'cors'

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
    const corsOptions: CorsOptions = {
      origin: '*',
    }
    this.express.use(express.json())
    this.express.use(cors(corsOptions))
    return this
  }
}

export default new App().middlewares().routes().express