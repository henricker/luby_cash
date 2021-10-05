import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('.env') })

export default {
  jwt: {
    secret: process.env.TOKEN_SECRET
  }
}