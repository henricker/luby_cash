import Database from '@ioc:Adonis/Lucid/Database'
import { Status } from 'App/Models/enum/status'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import { JwtType } from '__tests__/util/jwt-type'
import BASE_URL from '../../util/base-url'

test.group('#PixesController - store route', (group) => {
  let userIssuer: User
  let jwtUserIssuer: JwtType
  let userRecipient: User

  group.before(async () => {
    await Database.beginGlobalTransaction()
    userIssuer = await UserFactory.merge({
      cpfNumber: '22222222222',
      password: '123@Password',
      currentBalance: 2000,
    }).create()

    jwtUserIssuer = (
      await supertest(BASE_URL).post('/session').send({
        email: userIssuer.email,
        password: '123@Password',
      })
    ).body.jwt

    userRecipient = await UserFactory.merge({
      currentBalance: 500,
      cpfNumber: '32132132111',
    }).create()
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('should not transfer money when user is not authenticated', async (assert) => {
    const response = await supertest(BASE_URL).post('/users/pixes').send({
      cpf_recipient: '11111111111',
      transfer_value: 500,
    })

    assert.equal(response.status, 401)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'E_UNAUTHORIZED_ACCESS: Unauthorized access'
    )
  })

  test('should return an error when the cpf_recipient string is not 11 length', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '1111111111', //also 'aaaa131aaaa'
        transfer_value: 500,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 422)
    assert.propertyVal(response.body.errors[0], 'message', 'CPF validation failed')
  })

  test('should return an error when cpf_recipient has a non-numeric digit', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: 'aaaaaa111bb', //also 'aaaa131aaaa'
        transfer_value: 500,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 422)
    assert.propertyVal(response.body.errors[0], 'message', 'CPF validation failed')
  })

  test("should return an error when the sending user's current balance is less than the transfer amount", async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '32132132111', //also 'aaaa131aaaa'
        transfer_value: 3000,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 400)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'the current balance is less than the transfer amount'
    )
  })

  test('should return error when user recipient not found', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '12312312311',
        transfer_value: 500,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 404)
    assert.propertyVal(response.body.errors[0], 'message', 'E_ROW_NOT_FOUND: Row not found')
  })

  test('should return an error when the sender and recipient of the user are the same', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '22222222222',
        transfer_value: 100,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    await userIssuer.refresh()
    assert.equal(400, response.status)
    assert.propertyVal(response.body.errors[0], 'message', 'Unable to transfer to self')
    assert.propertyVal(userIssuer, 'currentBalance', 2000)
  })

  test('should transfer when all is fine', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '32132132111',
        transfer_value: 500,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    await userIssuer.refresh()
    await userRecipient.refresh()

    assert.equal(201, response.status)
    assert.equal(response.text, 'Transfer successful')
    assert.equal(userIssuer.currentBalance, 1500)
    assert.equal(userRecipient.currentBalance, 1000)
  })

  test('should return error when user issuer have status disaproved or null', async (assert) => {
    userIssuer.status = Status.DISAPPROVED
    await userIssuer.save()

    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '32132132111',
        transfer_value: 500,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 400)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'Cannot transfer when sender has no status or is disapproved'
    )
  })

  test('should return error when user recipient have status disaproved or null', async (assert) => {
    userIssuer.status = Status.APPROVED
    userRecipient.status = Status.DISAPPROVED
    await userIssuer.save()
    await userRecipient.save()

    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '32132132111',
        transfer_value: 500,
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 400)
    assert.propertyVal(
      response.body.errors[0],
      'message',
      'Cannot transfer when recipient has no status or is disapproved'
    )
  })

  test('should return error when cpf_recipient or transfer_value is invalid', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '',
        transfer_value: '',
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 422)
    assert.propertyVal(response.body.errors[0], 'message', 'cpf_recipient is required')
    assert.propertyVal(response.body.errors[1], 'message', 'transfer_value is required')
  })

  test('should return error when transfer_value is not a number', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users/pixes')
      .send({
        cpf_recipient: '11111111111',
        transfer_value: 'number',
      })
      .set('Authorization', `Bearer ${jwtUserIssuer.token}`)

    assert.equal(response.status, 422)
    assert.propertyVal(response.body.errors[0], 'message', 'number validation failed')
  })
})
