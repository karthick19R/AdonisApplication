import User from '#models/user'
import { JwtService } from '#services/jwt_service'
import { Exception } from '@adonisjs/core/exceptions'

export default class UserRepository {
  public async getdetail(id: number) {
    return User.findOrFail(id).catch(() => {
      console.log('Error in  getdetail finding user')
      throw new Exception('Error in  getdetail finding user', { status: 404 })
    })
  }

  public async updateuser(id:number,data: { fullName?: string, email?: string,password ?: string}) {
    const user = await User.findOrFail(id).catch((err)=>{
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
    const res =await user.delete()
    console.log(res)
    return res
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
    const jwtToken = await JwtService.tokenCreate(user.id , user.email)
    return { OAT :token.value!.release(), jwtToken} 

  }
}
