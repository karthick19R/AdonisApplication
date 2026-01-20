import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
  {
    fullName: 'Steve Smith',
    email: 'smith@example.com',
    password: 'secret',
  },
  {
    fullName: ' Johnson',
    email: 'johnson@example.com',
    password: 'secret',
  },
  {
    fullName: 'Robert',
    email: 'Robert@example.com',
    password: 'secret',
  },{
    fullName: 'carlos',
    email: 'carlos@example.com',
    password: 'secret',
  },{
    fullName: 'david',
    email: 'david@example.com',
    password: 'secret',
  },
])

  }
}