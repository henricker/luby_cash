import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { JwtType } from '../../util/jwt-type'
import BASE_URL from '../../util/base-url'

test.group('#AdminsController - list admins route', (group) => {
  let jwtAdmin: JwtType
  let jwtUser: JwtType
  group.before(async () => {
    await Database.beginGlobalTransaction()
    const adminTesting = await UserFactory.merge({ password: '123@Password', roleId: 1 }).create()
    const commonUser = await UserFactory.merge({ password: 'Password@123', roleId: 2 }).create()
    await UserFactory.merge({ roleId: 1 }).createMany(10)

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
    const response = await supertest(BASE_URL).get('/admins')

    assert.equal(401, response.status)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    )
  })

  test('should return error when user authenticated is not admin', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins')
      .set('Authorization', `Bearer ${jwtUser.token}`)

    assert.equal(403, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'Unauthorized error')
  })

  test('should return data array with admins when admin is authenticated', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.property(response.body, 'data')
    response.body.data.forEach((admin: any) => {
      assert.property(admin, 'id')
      assert.property(admin, 'full_name')
      assert.property(admin, 'phone')
      assert.property(admin, 'email')
      assert.property(admin, 'cpf_number')
      assert.property(admin, 'city')
      assert.property(admin, 'state')
      assert.property(admin, 'zipcode')
      assert.property(admin, 'created_at')
      assert.property(admin, 'updated_at')
    })
  })

  test('should return pagination default when not passing page or perPage query params', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.property(response.body, 'meta')
    assert.propertyVal(response.body.meta, 'current_page', 1)
    assert.propertyVal(response.body.meta, 'per_page', 10)
  })

  test('should return pagination with data of users when page is 2 and perPage is 3', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/admins?page=2&perPage=3')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.property(response.body, 'meta')
    assert.propertyVal(response.body.meta, 'current_page', 2)
    assert.propertyVal(response.body.meta, 'per_page', 3)
    assert.isArray(response.body.data)
  })
})
