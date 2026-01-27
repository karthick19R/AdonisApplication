import { BaseCommand,args } from '@adonisjs/core/ace'
//import { stubsRoot } from '../app/stubs/repository.stub';

export default class MakeRepository extends BaseCommand {
  static commandName = 'make:repository'
  static description = 'Make a new repository class'
  @args.string({description: 'Repository name' })
  declare name : string

  async run() {
  const codemods = await this.createCodemods()
  //const stubsPath = fileURLToPath(stubsRoot); // convert URL → string
const entity = this.app.generators.createEntity(this.name)

// await codemods.makeUsingStub(,
//   'empty.stub', // relative to stubsRoot
//   { entity }
// );

  }
}