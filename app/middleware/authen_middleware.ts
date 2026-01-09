import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserAuthenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const id = ctx.params.id
    console.log("Inside User Id verification Auth middleware")
    console.log(id)
    console.log(ctx.userid)
    if(!(id === ctx.userid)){
      return ctx.response.status(401).json({
        status :"failed",
        message : "You Dont have the Access"
      })
    }
    /**
     * Middleware logic goes here (before the next call)
     */
    //console.log(ctx)

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
  
}
