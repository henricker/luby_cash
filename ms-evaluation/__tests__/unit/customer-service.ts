// import { getCustomRepository } from "typeorm";
// import { Customer } from "../../src/application/entity/customer";
// import { CustomerRepository } from "../../src/application/repository/customer-repository";
// import { CustomerService } from "../../src/application/services/customer-service"

// describe('#CustomerService', () => {
//   describe('#evaluation', () => {
//     test('should return false when avarageSalary is less than 500', () => {
//       const solve = CustomerService.prototype['evaluation'](499)
//       expect(solve).toBe(false)
//     })
//     test('should return true when avarageSalary is greater than or equal to 500', () => {
//       const solve = CustomerService.prototype['evaluation'](500)
//       expect(solve).toBe(true)
//     })
//   })
//   describe('#store', () => {
//     afterEach(() => {
//       jest.restoreAllMocks()
//     })

//     test('should create customer with status true', async () => {
//       const customer: Customer = new Customer()

//       customer.name = 'henricker'
//       customer.email = 'henricker@email.com',
//       customer.averageSalary = 500
//       customer.createdAt = new Date()
//       customer.status = true
//       customer.id = 1
    
  
//       CustomerService.prototype['customerRepository'] = new CustomerRepository()
//       jest.spyOn(CustomerService.prototype['customerRepository'], 'create').mockImplementation().mockReturnValue(customer)
//       jest.spyOn(CustomerService.prototype['customerRepository'], 'save').mockImplementation()
//       jest.spyOn(CustomerService.prototype as any, 'evaluation')
    
//       await CustomerService.prototype['store']({ name: 'henricker', email: 'henricker@email.com', averageSalary: 500 })

//       expect(CustomerService.prototype['evaluation']).toReturnWith(true)
//       expect(CustomerService.prototype['customerRepository'].create).toReturnWith(customer)
//       expect(CustomerService.prototype['customerRepository'].save).toBeCalledWith(customer)
//     })
//     test('should create customer with status false', async () => {
//       const customer: Customer = new Customer()

//       customer.name = 'henricker'
//       customer.email = 'henricker@email.com',
//       customer.averageSalary = 499
//       customer.createdAt = new Date()
//       customer.status = false
//       customer.id = 1
    
  
//       CustomerService.prototype['customerRepository'] = new CustomerRepository()
//       jest.spyOn(CustomerService.prototype['customerRepository'], 'create').mockImplementation().mockReturnValue(customer)
//       jest.spyOn(CustomerService.prototype['customerRepository'], 'save').mockImplementation()
//       jest.spyOn(CustomerService.prototype as any, 'evaluation')
    
//       await CustomerService.prototype['store']({ name: 'henricker', email: 'henricker@email.com', averageSalary: 499 })

//       expect(CustomerService.prototype['evaluation']).toReturnWith(false)
//       expect(CustomerService.prototype['customerRepository'].create).toReturnWith(customer)
//       expect(CustomerService.prototype['customerRepository'].save).toBeCalledWith(customer)
//     })
//   })
// })