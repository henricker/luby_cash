import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import BASE_URL from '../../util/base-url'

test.group('#SessionController - store route', (group) => {
  group.before(async () => {
    await Database.beginGlobalTransaction()
    await UserFactory.merge({
      email: 'henricker@email.com',
      password: '123@Password',
    }).create()
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('Must return a jwt token when a user authenticates', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: 'henricker@email.com',
      password: '123@Password',
    })

    assert.property(response.body, 'jwt')
  })

  test('Should return an error when credentials are wrong', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: 'henricker@email.com',
      password: 'Password@123',
    })

    assert.property(response.body, 'errors')
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'E_INVALID_AUTH_PASSWORD: Password mis-match'
    )
  })

  test('Should return an error when email or password is invalid data', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: '',
      password: '',
    })

    assert.propertyVal(response.body.errors[0], 'message', 'email is required')
    assert.propertyVal(response.body.errors[1], 'message', 'password is required')
  })

  test('Should return an error when email is invalid', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: 'mail',
      password: '123@Password',
    })

    assert.propertyVal(response.body.errors[0], 'message', 'email is invalid')
  })

  test('Should return an error when email or password is not string', async (assert) => {
    const response = await supertest(BASE_URL).post('/session').send({
      email: 2,
      password: 1,
    })

    assert.propertyVal(response.body.errors[0], 'message', 'string validation failed')
    assert.propertyVal(response.body.errors[0], 'field', 'email')
    assert.propertyVal(response.body.errors[1], 'message', 'string validation failed')
    assert.propertyVal(response.body.errors[1], 'field', 'password')
  })
})
