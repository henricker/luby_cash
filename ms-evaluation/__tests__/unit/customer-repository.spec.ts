import { Client, QueryResult } from "pg"
import Customer from "../../src/application/entity/customer"
import { CustomerRepository } from "../../src/application/repository/customer-repository"


describe('#CustomerRepository', () => {

  const dateCreated = new Date()
  describe('#create', () => {
    jest.spyOn(Client.prototype, 'connect').mockImplementation()
    jest.spyOn(Client.prototype, 'end').mockImplementation()

    test('should be create a customer', async () => {

      const dateCreated = new Date()
      const customerMockedClientPg: QueryResult<any> = {
        rows: [
          { name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1, created_at: dateCreated }
        ],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }
  
      jest.spyOn(Client.prototype, 'query').mockImplementation((text, values) => {
        return customerMockedClientPg
      })

      const customerRepository = new CustomerRepository()
  
      const customer = await customerRepository.create(new Customer({ 
        name: 'henricker', 
        email: 'henricker@email.com', 
        average_salary: 5000, 
        status: true, 
        id: 1, 
        created_at: dateCreated 
      }))
  
      expect(customer).toStrictEqual(new Customer({
        name: 'henricker', 
        email: 'henricker@email.com',
        average_salary: 5000, 
        status: true,
        id: 1,
        created_at: dateCreated
      }))
    })

  })

  describe('#findById', () => {
        jest.spyOn(Client.prototype, 'connect').mockImplementation()
        jest.spyOn(Client.prototype, 'end').mockImplementation()

        test('should be return a customer', async () => {

          const dateCreated = new Date()
          const customerMockedClientPg: QueryResult<any> = {
            rows: [
              { name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1, created_at: dateCreated }
            ],
            command: '',
            rowCount: 1,
            oid: 0,
            fields: []
          }
      
          jest.spyOn(Client.prototype, 'query').mockImplementation((text, values) => {
            return customerMockedClientPg
          })
          const customer: Customer = new Customer({ name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1 })
          const customerRepository = new CustomerRepository()
          const testingCustomer = await customerRepository.findById(1)
          expect(testingCustomer).toStrictEqual(customer)
      })

      test('should be return undefined when customer not exists', async () => {

        const dateCreated = new Date()
        const customerMockedClientPg: QueryResult<any> = {
          rows: [],
          command: '',
          rowCount: 0,
          oid: 0,
          fields: []
        }

        jest.spyOn(Client.prototype, 'query').mockImplementation((text, values) => {
          return customerMockedClientPg
        })

        const customerRepository = new CustomerRepository()
        const testingCustomer = await customerRepository.findById(1)
        expect(testingCustomer).toStrictEqual(undefined)
    })
  describe('#find', () => {
    test('should return customers', async () => {
      jest.spyOn(Client.prototype, 'connect').mockImplementation()
      jest.spyOn(Client.prototype, 'end').mockImplementation()

      const customerMockedClientPg: QueryResult<any> = {
        rows: [
          { name: 'Joe Doe', email: 'Doe@email.com', average_salary: 6000, status: true, id: 1, created_at: dateCreated },
          { name: 'Doe Joe', email: 'Joe@email.com', average_salary: 500, status: true, id: 2, created_at: dateCreated },
          { name: 'Timber Mcarty', email: 'timber@email.com', average_salary: 300, status: false, id: 3, created_at: dateCreated },
          { name: 'Lucian', email: 'lucian@email.com', average_salary: 200, status: false, id: 4, created_at: dateCreated },
          { name: 'Dr mundo', email: 'dr@email.com', average_salary: 8000, status: true, id: 6, created_at: dateCreated }
        ],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }

      jest.spyOn(Client.prototype, 'query').mockImplementation((text, values) => {
        return customerMockedClientPg
      })

      const customerRepository = new CustomerRepository()
      const customers = await customerRepository.find({})

      expect(customers).toStrictEqual([
        new Customer({ name: 'Joe Doe', email: 'Doe@email.com', average_salary: 6000, status: true, id: 1, created_at: dateCreated }),
        new Customer({ name: 'Doe Joe', email: 'Joe@email.com', average_salary: 500, status: true, id: 2, created_at: dateCreated }),
        new Customer({ name: 'Timber Mcarty', email: 'timber@email.com', average_salary: 300, status: false, id: 3, created_at: dateCreated }),
        new Customer({ name: 'Lucian', email: 'lucian@email.com', average_salary: 200, status: false, id: 4, created_at: dateCreated }),
        new Customer({ name: 'Dr mundo', email: 'dr@email.com', average_salary: 8000, status: true, id: 6, created_at: dateCreated })
      ])
    })
  })
})
})