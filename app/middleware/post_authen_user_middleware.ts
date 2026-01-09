import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PostAuthenUserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
  // const {userid} = ctx
   //const id = 

    console.log(ctx)

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}