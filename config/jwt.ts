import env from '#start/env'

export default {
  secret: env.get('APP_KEY'),
  expiresIn: 60*60*24,
}
