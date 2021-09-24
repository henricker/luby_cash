import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { PixFactory, UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { JwtType } from '__tests__/util/jwt-type'
import BASE_URL from '../../util/base-url'

test.group('#PixesController - statement client route', (group) => {
  let adminUser: User
  let commonUser: User
  let jwtAdmin: JwtType
  let jwtUser: JwtType
  group.before(async () => {
    await Database.beginGlobalTransaction()
    await UserFactory.merge({ currentBalance: 3100, averageSalary: 500 }).createMany(5)

    for (let i = 2; i <= 5; i++) {
      await PixFactory.merge({ issuerUser: 1, recipientUser: i }).create()
      await PixFactory.merge({ issuerUser: i, recipientUser: 1 }).create()
    }
    adminUser = await UserFactory.merge({ password: 'Password@123', roleId: 1 }).create()
    commonUser = await UserFactory.merge({ password: '123@Password' }).create()

    jwtAdmin = (
      await supertest(BASE_URL)
        .post('/session')
        .send({ email: adminUser.email, password: 'Password@123' })
    ).body.jwt

    jwtUser = (
      await supertest(BASE_URL)
        .post('/session')
        .send({ email: commonUser.email, password: '123@Password' })
    ).body.jwt
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('should return error when admin is not authenticated', async (assert) => {
    const response = await supertest(BASE_URL).get('/admins/users/1/pixes')

    assert.equal(401, response.status)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    )
  })

  test('should return error when user is not admin', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users/1/pixes')
      .set('Authorization', `Bearer ${jwtUser.token}`)

    assert.equal(403, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'Unauthorized error')
  })

  test('should return data with pixes of user with default pagination', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users/1/pixes')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.equal(200, response.status)
    assert.isArray(response.body.data)
    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
    response.body.data[0].transfers.forEach((transfer: any) => {
      assert.property(transfer, 'nameIssuer')
      assert.property(transfer, 'cpfIssuer')
      assert.property(transfer, 'nameRecipient')
      assert.property(transfer, 'cpfRecipient')
      assert.property(transfer, 'transferValue')
      assert.property(transfer, 'createdAt')
    })
  })

  test('should return data with pixes of user with page=2 and perPage=3', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users/1/pixes?page=2&perPage=3')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.equal(200, response.status)
    assert.isArray(response.body.data)
    assert.propertyVal(response.body.meta, 'current_page', 2)
    assert.propertyVal(response.body.meta, 'per_page', 3)
    assert.equal(3, response.body.data[0].transfers.length)
  })

  test('should return data with pagination default when page and perPage is invalid', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users/1/pixes?page=b&perPage=a')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.equal(200, response.status)
    assert.isArray(response.body.data)
    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
  })

  test('should return data with pixes of user with default pagination', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users/100/pixes')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.equal(404, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'E_ROW_NOT_FOUND: Row not found')
  })
})
