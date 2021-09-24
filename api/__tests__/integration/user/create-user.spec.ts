import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import BASE_URL from '../../util/base-url'

test.group('#UsersController - store user route', (group) => {
  group.before(async () => {
    await Database.beginGlobalTransaction()
    await UserFactory.merge({ cpfNumber: '11111111111', email: 'JoeDoe@email.com' }).create()
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('should return error when cpf already exists', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      fullName: 'Joe Doe',
      email: 'email@email.com',
      phone: '22334134521',
      cpfNumber: '11111111111',
      address: 'address random',
      city: 'city random',
      state: 'state random',
      zipcode: '123321231',
      avarageSalary: 1000,
      password: 'Password@123',
    })

    assert.equal(422, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'CPF already exists')
  })

  test('should return error when cpf is invalid', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      fullName: 'Joe Doe',
      email: 'email@email.com',
      phone: '22334134521',
      cpfNumber: 'abcdef11111',
      address: 'address random',
      city: 'city random',
      state: 'state random',
      zipcode: '123321231',
      avarageSalary: 1000,
      password: 'Password@123',
    })

    assert.equal(422, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'CPF validation failed')
  })

  test('should return error when email already exists', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      fullName: 'Joe Doe',
      email: 'JoeDoe@email.com',
      phone: '22334134521',
      cpfNumber: 'abcdef11111',
      address: 'address random',
      city: 'city random',
      state: 'state random',
      zipcode: '123321231',
      avarageSalary: 1000,
      password: 'Password@123',
    })

    assert.equal(422, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'email already exists')
  })

  test('should return error when email is invalid', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      fullName: 'Joe Doe',
      email: 'email',
      phone: '22334134521',
      cpfNumber: 'abcdef11111',
      address: 'address random',
      city: 'city random',
      state: 'state random',
      zipcode: '123321231',
      avarageSalary: 1000,
      password: 'Password@123',
    })

    assert.equal(422, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'email validation failed')
  })

  test('should return error when any data is not provided', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      fullName: '',
      email: '',
      phone: '',
      cpfNumber: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      avarageSalary: '',
      password: '',
    })

    assert.equal(422, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'fullName is required')
    assert.propertyVal(response.body.errors[1], 'message', 'email is required')
    assert.propertyVal(response.body.errors[2], 'message', 'cpfNumber is required')
    assert.propertyVal(response.body.errors[3], 'message', 'phone is required')
    assert.propertyVal(response.body.errors[4], 'message', 'city is required')
    assert.propertyVal(response.body.errors[5], 'message', 'state is required')
    assert.propertyVal(response.body.errors[6], 'message', 'zipcode is required')
    assert.propertyVal(response.body.errors[7], 'message', 'address is required')
    assert.propertyVal(response.body.errors[8], 'message', 'averageSalary is required')
    assert.propertyVal(response.body.errors[9], 'message', 'password is required')
  })

  test('should create user when all data is fine', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({
      fullName: 'Joe Doe',
      email: 'email@email.com',
      phone: '22334134521',
      cpfNumber: '12332112333',
      address: 'address random',
      city: 'city random',
      state: 'state random',
      zipcode: '123321231',
      averageSalary: 1000,
      password: 'Password@123',
    })

    assert.propertyVal(response.body.user, 'full_name', 'Joe Doe')
    assert.propertyVal(response.body.user, 'email', 'email@email.com')
    assert.propertyVal(response.body.user, 'id', 2)
  })
})
