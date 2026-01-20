import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class Logger {
    constructor() {
    console.log('Logger middleware instantiated')
  }
  public async handle(ctx: HttpContext, next: NextFn) {
    console.log('Incoming:', ctx.request.method(), ctx.request.url())

    await next()
   // console.log(ctx.response)
    console.log('Request finished')
  }
}