// import { Request, Response } from 'express'
// import BcryptHelper from '../../helpers/bcrypt'
// import JwtHelper from '../../helpers/jwt'
// import { CustomerRepository } from '../../repository/customer-repository'

// const customerRepository = new CustomerRepository()

// export default class SessionController {

//   public async store(request: Request, response: Response) {
//     try {
//       const { email, password } = request.body
//       const customer = await customerRepository.findByEmail(email)

//       if(!customer)
//         throw new Error('invalid credentials')

//       const checkPassword = await BcryptHelper.compare(password, customer.password)

//       if(!checkPassword)
//         throw new Error('invalid credentials')

//       const token = JwtHelper.generateToken({ id: customer.id })
//       return response.status(200).send({ token })
//     } catch(err) {
//       return response.status(400).send({ errors: [{ message: err.message }] })
//     }
//   }
// }