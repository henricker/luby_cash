import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { JwtType } from '../../util/jwt-type'
import BASE_URL from '../../util/base-url'
import User from 'App/Models/User'

test.group('#AdminsController - demote admin route', (group) => {
  let jwtAdmin: JwtType
  let jwtCommonUser: JwtType
  group.before(async () => {
    await Database.beginGlobalTransaction()
    //id = 1
    const admin = await UserFactory.merge({ roleId: 1, password: '123@Password' }).create()
    jwtAdmin = (
      await supertest(BASE_URL).post('/session').send({
        email: admin.email,
        password: '123@Password',
      })
    ).body.jwt

    //id = 2 //admin to demote
    await UserFactory.merge({ roleId: 1 }).create()

    //common user //id2= 3
    const commonUser = await UserFactory.merge({ roleId: 2, password: 'Password@123' }).create()
    jwtCommonUser = (
      await supertest(BASE_URL).post('/session').send({
        email: commonUser.email,
        password: 'Password@123',
      })
    ).body.jwt
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('An admin must make a another admin become common user', async (assert) => {
    const response = await supertest(BASE_URL)
      .patch('/admins/demote/2')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    const newAdmin = await User.findByOrFail('id', 2)
    await newAdmin.load('role')

    assert.equal(200, response.status)
    assert.equal('User with id 2 has been demoted', response.text)
    assert.equal(newAdmin.role.role, 'user')
  })

  test('Must not demote a user if the admin is not authenticated', async (assert) => {
    const response = await supertest(BASE_URL).patch('/admins/demote/2')

    assert.equal(401, response.status)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    )
  })

  test('Must not demote a user if the admin is common user', async (assert) => {
    const response = await supertest(BASE_URL)
      .patch('/admins/demote/2')
      .set('Authorization', `Bearer ${jwtCommonUser.token}`)

    assert.equal(403, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'Unauthorized error')
  })

  test('Should return error when user not found', async (assert) => {
    const response = await supertest(BASE_URL)
      .patch('/admins/demote/6')
      .set('Authorization', `Bearer ${jwtAdmin.token}`)

    assert.equal(404, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'E_ROW_NOT_FOUND: Row not found')
  })
})
