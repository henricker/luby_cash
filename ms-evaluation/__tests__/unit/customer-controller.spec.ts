import { request, response } from 'express'
import { Client, QueryResult } from 'pg'
import CustomerController from '../../src/application/api/controller/customer-controller'
import { CustomerRepository } from '../../src/application/repository/customer-repository'
import { CustomerService } from '../../src/application/services/customer-service'

describe('CustomerController', () => {
  describe('#store', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should call service store method and create method of repository when store method of controller is called', async () => {
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
  })
})