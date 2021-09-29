import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      roleId: 1,
      fullName: 'default admin',
      address: 'address',
      city: 'city',
      state: 'state',
      password: '123',
      phone: 'phone',
      cpfNumber: 'cpfNumber',
      averageSalary: 213,
      currentBalance: 231,
      email: 'henricker@email.com',
      zipcode: '12332145',
    })
  }
}
