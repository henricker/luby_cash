import { request, response } from 'express'
import { Client, QueryResult } from 'pg'
import CustomerController from '../../src/application/api/controller/customer-controller'
import Customer from '../../src/application/entity/customer'
import { CustomerRepository } from '../../src/application/repository/customer-repository'
import { CustomerService } from '../../src/application/services/customer-service'
import Producer from '../../src/infra/kafka/producer'

describe('CustomerController', () => {
  describe('#store', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should call store method of service, create method of repository, and query method of client postgres, when store method of controller is called', async () => {
      jest.spyOn(Client.prototype, 'connect').mockImplementation()
      jest.spyOn(Client.prototype, 'end').mockImplementation()
      jest.spyOn(Producer.prototype, 'connect').mockImplementation()
      jest.spyOn(Producer.prototype, 'disconect').mockImplementation()
      jest.spyOn(Producer.prototype, 'sendMessage').mockImplementation()

      const customerMockedClientPg: QueryResult<any> = {
        rows: [
          { name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1 }
        ],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }

      jest.spyOn(Client.prototype, 'query').mockImplementation((text, values) => {
        return customerMockedClientPg
      })

      jest.spyOn(CustomerRepository.prototype, 'create')

      jest.spyOn(CustomerService.prototype, 'store')

      request.body = { 
        name: 'henricker', 
        email: 'henricker@email.com',
        averageSalary: 500
      }

      response['send'] = jest.fn()

      await CustomerController.prototype.store(request, response)
      expect(Client.prototype.query).toBeCalled()
      expect(CustomerRepository.prototype.create).toBeCalled()
      expect(CustomerService.prototype.store).toBeCalled()
    })

    test('should call response send with customer when store method of controller is called', async () => {
      jest.spyOn(Client.prototype, 'connect').mockImplementation()
      jest.spyOn(Client.prototype, 'end').mockImplementation()

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

      jest.spyOn(CustomerRepository.prototype, 'create')

      jest.spyOn(CustomerService.prototype, 'store')

      request.body = { 
        name: 'henricker', 
        email: 'henricker@email.com',
        averageSalary: 500
      }

      response['send'] = jest.fn()

        await CustomerController.prototype.store(request, response)
        expect(response.send).toBeCalledWith({ customer: new Customer({ 
            name: 'henricker', 
            email: 'henricker@email.com', 
            average_salary: 5000, 
            status: true, 
            id: 1, 
            created_at: dateCreated
        })
      })
    })
  describe('#Index', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test('should call index method of service, find method of repository, and query method of client postgres, when store method of controller is called', async () => {
      jest.spyOn(Client.prototype, 'connect').mockImplementation()
      jest.spyOn(Client.prototype, 'end').mockImplementation()

      const customerMockedClientPg: QueryResult<any> = {
        rows: [
          { name: 'Joe Doe', email: 'Doe@email.com', average_salary: 6000, status: true, id: 1 },
          { name: 'Doe Joe', email: 'Joe@email.com', average_salary: 500, status: true, id: 2 },
          { name: 'Timber Mcarty', email: 'timber@email.com', average_salary: 300, status: false, id: 3 },
          { name: 'Lucian', email: 'lucian@email.com', average_salary: 200, status: false, id: 4 },
          { name: 'Dr mundo', email: 'dr@email.com', average_salary: 8000, status: true, id: 6 }
        ],
        command: '',
        rowCount: 1,
        oid: 0,
        fields: []
      }

      jest.spyOn(Client.prototype, 'query').mockImplementation((text, values) => {
        return customerMockedClientPg
      })

      jest.spyOn(CustomerRepository.prototype, 'find')
      jest.spyOn(CustomerService.prototype, 'index')

      response['send'] = jest.fn()

      request.query = { page: '0', limit: '10' }

      await CustomerController.prototype.index(request, response)
      expect(Client.prototype.query).toBeCalled()
      expect(CustomerRepository.prototype.find).toBeCalled()
      expect(CustomerService.prototype.index).toBeCalled()
    })
    test('should call send method of response with array of customers', async () => {
        jest.spyOn(Client.prototype, 'connect').mockImplementation()
        jest.spyOn(Client.prototype, 'end').mockImplementation()

        const dateCreated = new Date()
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

        jest.spyOn(CustomerRepository.prototype, 'find')
        jest.spyOn(CustomerService.prototype, 'index')

        response['send'] = jest.fn()

        request.query = { page: '0', limit: '10' }

        await CustomerController.prototype.index(request, response)
        expect(response.send).toBeCalledWith({ 
          customers: [
            new Customer({ name: 'Joe Doe', email: 'Doe@email.com', average_salary: 6000, status: true, id: 1, created_at: dateCreated }),
            new Customer({ name: 'Doe Joe', email: 'Joe@email.com', average_salary: 500, status: true, id: 2, created_at: dateCreated }),
            new Customer({ name: 'Timber Mcarty', email: 'timber@email.com', average_salary: 300, status: false, id: 3, created_at: dateCreated }),
            new Customer({ name: 'Lucian', email: 'lucian@email.com', average_salary: 200, status: false, id: 4, created_at: dateCreated }),
            new Customer({ name: 'Dr mundo', email: 'dr@email.com', average_salary: 8000, status: true, id: 6, created_at: dateCreated })
          ] 
        })
      })
    })
  })
})