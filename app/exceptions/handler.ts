import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as AdonisErrors } from '@adonisjs/core'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * Show detailed errors in development, hide them in production
   */
  protected debug = !app.inProduction

  /**
   * Handle exceptions and send JSON responses
   */
  public async handle(error: any, ctx: HttpContext) {
    if (error instanceof AdonisErrors.E_ROUTE_NOT_FOUND) {
      return ctx.response.status(404).json({
        success: false,
        message: 'Data not found',
        error: error.message,
        stack : "error.stack"
      })
    }

    if (error.status === 422 && error.messages) {
      return ctx.response.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    if (error.status === 400) {
      return {
        success: false,
        message: 'Bad request, please recheck your request',
        error: error.message,
      }
    }

    if (error.status === 401) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Unauthorized access',
        error: error.message,
      })
    }

    if (error.status === 404) {
      return ctx.response.status(404).json({
        success: false,
        message: 'Data not found',
        error: error.message,
      })
    }

    if (error.status === 500) {
      return ctx.response.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message, 
        stack : error.stack
      })
    }

    if (error.code === '28P01') {
      return ctx.response.status(500).json({
        success: false,
        message: 'Database authentication failed',
        error: error.message,
      })
    }

    if (error.code === '3D000') {
      return ctx.response.status(500).json({
        success: false,
        message: 'Database does not exist / mismatched',
        error: error.message,
      })
    }

    if (error.code === 'ECONNREFUSED') {
      return ctx.response.status(500).json({
        success: false,
        message: 'Database connection refused',
        error: error.message,
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * Report errors (logs, monitoring, etc.)
   */
  public async report(error: unknown, ctx: HttpContext) {
    // Log server errors in production
    if (!app.inProduction || (error as any).status >= 500) {
      console.error(error)
    }

    return super.report(error, ctx)
  }
}
