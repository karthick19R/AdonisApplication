import jwt, { JwtPayload } from 'jsonwebtoken'
import jwtconfig from '#config/jwt'
export class JwtService {
  static sign(object : JwtPayload){
    return jwt.sign(object,jwtconfig.secret,{
      expiresIn: jwtconfig.expiresIn
    })
  }
   static verify(token : string) {
    return jwt.verify(token, jwtconfig.secret)
  }
}

