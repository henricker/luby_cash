import Customer from "../../src/application/entity/customer";
import { CustomerRepository } from "../../src/application/repository/customer-repository";
import { CustomerService } from "../../src/application/services/customer-service"

describe('#CustomerService', () => {
  describe('#evaluation', () => {
    test('should return false when avarageSalary is less than 500', () => {
      const solve = CustomerService.prototype['evaluation'](499)
      expect(solve).toBe(false)
    })
    test('should return true when avarageSalary is greater than or equal to 500', () => {
      const solve = CustomerService.prototype['evaluation'](500)
      expect(solve).toBe(true)
    })
  })
  describe('#store', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should create customer with status true', async () => {
      const customer: Customer = new Customer({ name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1 })
      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'create').mockImplementation().mockResolvedValue(customer)
      jest.spyOn(CustomerService.prototype as any, 'evaluation')
      const testCustomer = await CustomerService.prototype['store']({ name: 'henricker', email: 'henricker@email.com', averageSalary: 5000 })
      expect(CustomerService.prototype['evaluation']).toReturnWith(true)
      expect(CustomerService.prototype['customerRepository'].create).toBeCalled()
      expect(testCustomer).toStrictEqual(customer)
    })
    test('should create customer with status false', async () => {
      const customer: Customer = new Customer({ name: 'henricker', email: 'henricker@email.com', average_salary: 40, status: false, id: 1 })
      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'create').mockImplementation().mockResolvedValue(customer)
      jest.spyOn(CustomerService.prototype as any, 'evaluation')
      const testCustomer = await CustomerService.prototype['store']({ name: 'henricker', email: 'henricker@email.com', averageSalary: 499 })
      expect(CustomerService.prototype['evaluation']).toReturnWith(false)
      expect(CustomerService.prototype['customerRepository'].create).toBeCalled()
      expect(testCustomer).toStrictEqual(customer)
    })
  })

  describe('#index', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should return array with customers', async () => {
      const customers = [
        new Customer({ name: 'henricker', email: 'marchielo@email.com', average_salary: 5000, status: true, id: 1 }),
        new Customer({ name: 'marchielo', email: 'henricker@email.com', average_salary: 5000, status: true, id: 2 }),
        new Customer({ name: 'bluberry', email: 'bluberry@email.com', average_salary: 5000, status: true, id: 3 }),
        new Customer({ name: 'margarita', email: 'margarita@email.com', average_salary: 5000, status: true, id: 4 }),
      ]

      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'find').mockImplementation().mockResolvedValue(customers)
      const testingCustomers = await CustomerService.prototype.index()

      expect(testingCustomers).toStrictEqual(customers)
    })

    test('should call "find" method of repository when index method is called', async () => {
      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'find').mockImplementation()
      await CustomerService.prototype.index()
      expect(CustomerService.prototype['customerRepository'].find).toBeCalled()
    })
  })
  describe('#show', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should return user with by id', async () => {
      const customer: Customer = new Customer({ name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1 })

      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'findById').mockImplementation().mockResolvedValue(customer)
      const testingCustomer = await CustomerService.prototype.show(1)

      expect(testingCustomer).toStrictEqual(customer)
    })
    test('should return user with by id', async () => {
      const customer: Customer = new Customer({ name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1 })
      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'findById').mockImplementation().mockResolvedValue(customer)
      const testingCustomer = await CustomerService.prototype.show(1)

      expect(CustomerService.prototype['customerRepository'].findById).toBeCalled()
    })
    test('should return error when user not found', async () => {
      CustomerService.prototype['customerRepository'] = new CustomerRepository()
      jest.spyOn(CustomerService.prototype['customerRepository'], 'findById').mockImplementation()
      try {
        await CustomerService.prototype.show(1)
      } catch(err) {
        expect(err.message).toBe('customer not found')
        expect(CustomerService.prototype['customerRepository'].findById).toBeCalled()
      }
    })
  })
})