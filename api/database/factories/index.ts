import Factory from '@ioc:Adonis/Lucid/Factory'
import { Status } from 'App/Models/enum/status'
import Pix from 'App/Models/Pix'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    fullName: faker.name.firstName() + ' ' + faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(12),
    zipcode: faker.address.zipCode(),
    city: faker.address.cityName(),
    state: faker.address.state(),
    address: faker.address.streetName(),
    cpfNumber: faker.random.alphaNumeric(11),
    averageSalary: Number(faker.finance.amount(1000, 10000)),
    currentBalance: Number(faker.finance.amount(1000, 100000)),
    phone: faker.phone.phoneNumber(),
    status: Status.APPROVED,
    statusDate: DateTime.fromJSDate(faker.date.recent(30, new Date('2021-09-23T00:00:00Z'))),
  }
}).build()

export const PixFactory = Factory.define(Pix, () => {
  return {
    recipientUser: 1,
    issuerUser: 2,
    transferValue: 100,
  }
}).build()
