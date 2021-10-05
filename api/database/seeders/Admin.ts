import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Admin from 'App/Models/Admin'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await Admin.create({
      roleId: 1,
      fullName: 'default admin',
      password: '123',
      email: 'henricker@email.com',
    })
  }
}
