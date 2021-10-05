import jwt from 'jsonwebtoken'
import env from '../../../env'

export default class JwtHelper {
  public static generateToken(payload: {}) {
    const token = jwt.sign(payload, env.jwt.secret)
    return token
  }
}