import { BaseCommand,args} from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Time extends BaseCommand {
  static commandName = 'time'
  static description = 'This help to view current time'

  static options: CommandOptions = {}

  // async run() {
  //   this.logger.info('Hello world from "Time"')
  // }
  @args.string({default : "no time specified"})
  declare date:string
  
  async prepare(..._: any[]) {
    this.date = await this.prompt.ask("Can you enter the time :")
    console.log("Going to check the prepare the time command",this.date)
  }
  async interact(..._: any[]) {
    this.logger.log(`Time command interacting${this.date}`)
    
  }
  async run(){
    this.logger.info(`Hello world from Time and the time is ${this.date}`)
  }
  async completed(..._: any[]) {
    this.logger.info("Time command completed")
  }
}