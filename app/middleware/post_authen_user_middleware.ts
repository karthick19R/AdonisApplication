import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PostAuthenUserMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    try {
      console.log("Inside PostAuthenUserMiddleware")
       await ctx.auth.authenticate()
      //console.log('Authenticated user:', user)
      console.log(ctx.auth.user?.id)
    } catch (error) {
      return ctx.response.unauthorized({
        message: 'Authentication failed by OAT ',
        error: error.message,
      })
    }

    return next()
  }
}
