import { Client, Pool } from 'pg'

export default (): Client => new Client({
  host: 'localhost',
  port: 5432,
  user: 'ms_evaluation',
  password: 'ms_evaluation',
  database: 'ms_evaluation',
})





