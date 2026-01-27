import User from '#models/user'
import { JwtService } from '#services/jwt_service'
import { Exception } from '@adonisjs/core/exceptions'
import Post from '#models/post'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
export default class UserRepository {
  public async getdetail(id: number) {
    return User.findOrFail(id).catch(() => {
      console.log('Error in  getdetail finding user')
      throw new Exception('Error in  getdetail finding user', { status: 404 })
    })
  }

  public async updateuser(id:number,data: { fullName?: string, email?: string,password ?: string}) {
    const user = await User.findOrFail(id).catch(()=>{
            throw new Exception("No user found",{status:404})
    })
    const newData : Record<string, string> = {}
    Object.entries(data).forEach(([key,value])=>{
        if(!value)newData[key]= value;
    })
    user.merge(newData)
    return await  user.save()
  }

  public async createUser(user : {fullName : string , password :string,email:string}){
    return User.create(user)
  }

  public async deleteUser(id :number){
    const user = await User.findOrFail(id).catch(()=>{
        throw "User not found"
    })
    await user.delete().catch(()=>{ throw "Error while deleting User"})
    return true
  }
   
  public async getUserByEmail(email :string){
    const user = await User.findByOrFail('email',email).catch(()=>{
      throw "No User found"
    })
    return user
  }

  public async login(email :string ,password : string){
     const verify =await User.verifyCredentials(email,password).catch(()=>{
      throw "Invalid Credentials"
     })
     const user = await User.findByOrFail('email',verify.email).catch(()=>{
      throw "User not found"
     })
    const token = await User.accessTokens.create(user).catch(()=>{throw "Error while generating OAT token"})
    console.log(token)
    const jwtToken =  JwtService.tokenCreate(user.id , user.email)
    return { OAT :token.value!.release(), jwtToken} 

  }
  public async cleanupInactiveUsers(days : number){
    const cutoffDate = DateTime.now().minus({ days }).toSQL()!
    const activeUserIdsQuery = Post.query()
      .select('senderid')
      .where('created_at', '>=', cutoffDate)
      .union((q) => {
        q.select('receiverid')
          .from('posts')
          .where('created_at', '>=', cutoffDate)
      })

    const inactiveUsers = await User.query()
      .whereNotIn('id', activeUserIdsQuery)

    const count = inactiveUsers.length

    await db.transaction(async (trx) => {
      for (const user of inactiveUsers) {
        user.useTransaction(trx)
        await user.delete()
      }
    })

    return count
  }

  }

