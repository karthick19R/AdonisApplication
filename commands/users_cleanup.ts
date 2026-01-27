import { BaseCommand, flags } from '@adonisjs/core/ace'
import UserDomain from '../app/domains/user_domain.js'
import UserRepository from '../app/repositories/user_repository.js'

export default class UsersCleanup extends BaseCommand {
  static commandName = 'users:cleanup'
  static description = 'Delete users with no recent message activity'

  static options = {
    startApp: true,
  }

  @flags.number({
    description: 'Inactive for N days',
    default: 90,
  })
  declare days: number

  async run() {
    this.logger.info(`Finding users inactive for ${this.days} days`)

    const confirm = await this.prompt.confirm(
      'This will delete users permanently. Continue?'
    )

    if (!confirm) {
      this.logger.warning('Cancelled')
      return
    }

    const domain = new UserDomain()
    const repo = new UserRepository()
    const noDays = await domain.deleteInActive(this.days)
    const deletedCount = await repo.cleanupInactiveUsers(noDays)

    this.logger.success(`${deletedCount} users deleted`)
  }
}
