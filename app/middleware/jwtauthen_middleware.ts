import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { JwtService } from '#services/jwt_service'
import User from '#models/user'

interface JwtPayload{
  id :number
  email:string
}
//payload: JwtPayload | string;

export default class JwtauthenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log('Inside Jwt Authentication middleware')
    //console.log(ctx)
    
    const bear = ctx.request.header('authorization')
    if (!bear) return ctx.response.status(401).json({ messages: 'Authentication missing' })
    const token = bear.replace('Bearer ', '')
    try {
      const payload = JwtService.verify(token) as JwtPayload
      console.log('payload', payload)
      //id = payload.id;
      console.log(payload.constructor.name)
      if(!payload.email)throw "Error IN PAYLOAD"
      //if(!payload.id)throw "Error IN PAYLOAD"
      //const {email} = payload
      console.log(payload.email)
      const user = await User.findByOrFail('email', payload.email)
      console.log(user)
      ctx.userid = user.id
    } catch (err) {
      console.log('Jwt Authentication middleware failed')
      return ctx.response.status(500).json({
        message: 'Jwt Authentication middleware failed',
      })
    }
    const output = await next()
    console.log('Jwt Authentication middleware ended')
    return output
  }
}
