import jwt from 'jsonwebtoken'
import jwtconfig from '#config/jwt'
interface Payload{
  id : number,
  email :string
}

export class JwtService {
  
  static sign(object : Payload){
    return jwt.sign(object,jwtconfig.secret,{
      expiresIn: jwtconfig.expiresIn
    })
  }
   static verify(token : string) {
    return jwt.verify(token, jwtconfig.secret) as Payload
  }
  static tokenCreate(id:number, email:string ){
        return this.sign({ id, email })}

static verifyToken(token : string ){
        return this.verify(token)}
}
console.log()
