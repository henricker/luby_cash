import 'reflect-metadata'
import {createConnection} from 'typeorm';

createConnection().then(async () => {
  const app = await import('./app')
  app.default.listen(3333)
})


