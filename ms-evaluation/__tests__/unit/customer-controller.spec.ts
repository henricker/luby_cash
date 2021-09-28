import { request, response } from 'express'
import { Client, QueryResult } from 'pg'
import CustomerController from '../../src/application/api/controller/customer-controller'
import Customer from '../../src/application/entity/customer'
import { CustomerRepository } from '../../src/application/repository/customer-repository'
import { CustomerService } from '../../src/application/services/customer-service'

describe('CustomerController', () => {
  describe('#store', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should call store method of service, create method of repository, and query method of client postgres, when store method of controller is called', async () => {
      jest.spyOn(Client.prototype, 'connect').mockImplementation()
      jest.spyOn(Client.prototype, 'end').mockImplementation()

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

      const customerMockedClientPg: QueryResult<any> = {
        rows: [
          { name: 'henricker', email: 'henricker@email.com', average_salary: 5000, status: true, id: 1, created_at: new Date() }
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
            createdAt: new Date()
        })
      })
    })
    describe('#Index', () => {
      test.todo('should call index method of service, find method of repository, and query method of client postgres, when store method of controller is called')
      test.todo('should call send method of response with array of customers')
    })
  })
})