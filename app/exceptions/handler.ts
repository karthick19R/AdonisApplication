import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */

  async handle(error : any, ctx: HttpContext) {
    
    if (error.code === "E_ROUTE_NOT_FOUND") {
      console.log("error E_ROUTE_NOT_FOUND")
      return ctx.response.status(404).json({
        message : "Route not found"
      })
    }
     if(error.status === 422){
      return ctx.response.status(422).json({
        message : "Validation failed",
        error : error.messages
      })
    }
    if(error.status === 400){
      return ctx.response.status(400).json({
        message : "Bad Request,please recheck the request",
        error :error.message
      })
    }if(error.status === 401){
      return ctx.response.status(401).json({
        message : "Sorry you are unauthorized",
        error :error.message
      })
    }if(error.status === 404){
      //invalid url or endpoint or resource does not exits
      return ctx.response.status(404).json({
        message : "Not found ",
        error :error.message
      })
    }if(error.status === 500){
      return ctx.response.status(500).json({
        message : "Sorry some problem with server",
        error :error.message
      })
    }
    if(error.code === "28P01"){
      return ctx.response.status(500).json({
        message : "Database Auth Failed",
        error :error.message
      })
    }
    if(error.code === "3D000"){
      return ctx.response.status(500).json({
        message : "Database mismatched",
        error :error.message
      })
    }
    if(error.code === "ECONNREFUSED"){
      return ctx.response.status(500).json({
        message : "Database port error",
        error :error.message
      })
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
