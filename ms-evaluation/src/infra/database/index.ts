import { createConnection  } from 'typeorm'

createConnection()
  .then(() => console.log('Data base connected'))
  .catch((err) => console.log('Error on connect to database'))
