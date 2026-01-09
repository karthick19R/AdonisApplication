import type { HttpContext } from '@adonisjs/core/http'

export default class RequestSizeLimiter {
  private MAX_SIZE = 1_000_000 
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const size = request.header('content-length')
    console.log("inside request size limiter middleware");
    if (size && Number(size) > this.MAX_SIZE) {
      return response.status(413).send({
        message: 'Request too large',
      })
    }

    await next()
  }
}
