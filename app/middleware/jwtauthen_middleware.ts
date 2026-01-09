import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { JwtService } from '#services/jwt_service'
import User from '#models/user'
export default class JwtauthenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log("Inside Jwt Authentication middleware")
    //console.log(ctx)
    const bear = ctx.request.header('authorization')
    if(!bear)return ctx.response.status(401).json({messages :"Authentication missing"
    })
    const token = bear.replace('Bearer ','')
    try{
      const payload =  JwtService.verify(token)
      console.log("payload",payload)
      const email = payload.email;
      console.log(email)
      const user = await User.findByOrFail('email',payload.email)
      console.log(user)
      ctx.userid = user.id;
    }catch(err){
      console.log("Jwt Authentication middleware failed")
      return ctx.response.status(500).json({
        message : "Jwt Authentication middleware failed"
      })
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    console.log("Jwt Authentication middleware ended")
    return output
  }
}