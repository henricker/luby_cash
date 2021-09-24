import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { JwtType } from '../../util/jwt-type'
import BASE_URL from '../../util/base-url'
import { Status } from 'App/Models/enum/status'
import { DateTime } from 'luxon'

test.group('#AdminsController - list admins route', (group) => {
  let jwtAdmin: JwtType
  let jwtUser: JwtType
  group.before(async () => {
    await Database.beginGlobalTransaction()
    const adminTesting = await UserFactory.merge({ password: '123@Password', roleId: 1 }).create()
    const commonUser = await UserFactory.merge({
      password: 'Password@123',
      roleId: 2,
      statusDate: DateTime.fromJSDate(new Date('2021-09-24')).plus({ days: 1 }),
    }).create()
    await UserFactory.merge({
      roleId: 2,
      statusDate: DateTime.fromJSDate(new Date('2021-09-23')).plus({ days: 1 }),
    }).createMany(5)
    await UserFactory.merge({
      roleId: 2,
      status: Status.DISAPPROVED,
      statusDate: DateTime.fromJSDate(new Date('2021-09-23')).plus({ days: 1 }),
    }).createMany(5)

    jwtAdmin = (
      await supertest(BASE_URL)
        .post('/session')
        .send({ email: adminTesting.email, password: '123@Password' })
    ).body.jwt

    jwtUser = (
      await supertest(BASE_URL)
        .post('/session')
        .send({ email: commonUser.email, password: 'Password@123' })
    ).body.jwt
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('should return error when admin is not authenticated', async (assert) => {
    const response = await supertest(BASE_URL).get('/admins/users')

    assert.equal(401, response.status)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    )
  })

  test('should return error when user authenticated is not admin', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users')
      .set('Authorization', `Bearer ${jwtUser.token}`)

    assert.equal(403, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'Unauthorized error')
  })

  test('should return data with clients approved of luby cash when admin is authenticated', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users?status=approved')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.property(response.body, 'data')
    response.body.data.forEach((client: any) => {
      assert.property(client, 'id')
      assert.property(client, 'full_name')
      assert.property(client, 'phone')
      assert.property(client, 'email')
      assert.property(client, 'cpf_number')
      assert.property(client, 'city')
      assert.propertyVal(client, 'status', 'approved')
      assert.property(client, 'state')
      assert.property(client, 'zipcode')
      assert.property(client, 'created_at')
      assert.property(client, 'updated_at')
    })
  })

  test('should return data with clients disapproved of luby cash when admin is authenticated', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users?status=disapproved')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.property(response.body, 'data')
    response.body.data.forEach((client: any) => {
      assert.property(client, 'id')
      assert.property(client, 'full_name')
      assert.property(client, 'phone')
      assert.property(client, 'email')
      assert.property(client, 'cpf_number')
      assert.property(client, 'city')
      assert.propertyVal(client, 'status', 'disapproved')
      assert.property(client, 'state')
      assert.property(client, 'zipcode')
      assert.property(client, 'created_at')
      assert.property(client, 'updated_at')
    })
  })

  test('should return paging default data and clients with status approved when no query parameters are parsed', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
    assert.property(response.body, 'data')
    response.body.data.forEach((client: any) => {
      assert.propertyVal(client, 'status', 'approved')
    })
  })

  test('should return page 2 and perPage 3 clients with status dissaproved when no query parameters are parsed', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users?status=disapproved&page=2&perPage=3')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.propertyVal(response.body.meta, 'current_page', 2)
    assert.propertyVal(response.body.meta, 'per_page', 3)
    assert.property(response.body, 'data')
    response.body.data.forEach((client: any) => {
      assert.propertyVal(client, 'status', 'disapproved')
    })
  })

  test('should return data with default paging (current_page = 1 and per_page = 10) when page and perPage params is less than or equal to 0', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users?page=-1&perPage=-1')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
    assert.isArray(response.body.data)
  })

  test('should return data with default paging (current_page = 1 and per_page = 10) when page and perPage params is not a number', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users?page=a&perPage=b')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
    assert.isArray(response.body.data)
  })

  test('must return users with approved status with the statusDate query parameter provided with default pagination', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins/users?statusDate=2021-09-23&status=approved')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
    response.body.data.map((user: any) => {
      assert.equal(user.status_date.replace(/T.+/g, ''), '2021-09-23')
    })
  })
})
