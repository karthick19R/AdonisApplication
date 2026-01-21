import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import { signupvalidator, checkid, updateuserValidator, checkemail ,userValidatorLogin } from '../validators/user.js'
import { JwtService } from '#services/jwt_service'
import UserDomain from '../domains/user_domain.js'

   interface userData {
    id : number,
    email :string,
    fullName : string
  }

export default class UsersController {
  private userDomain : UserDomain;
  constructor(){
    this.userDomain = new UserDomain()
  }
 
  public async getdetail(ctx: HttpContext) {
      //console.log("Inside user controller getdetail"); 
      const validId = await checkid.validate({id : ctx.userid})
      const data : userData = await this.userDomain.getDetail(validId.id);
      return {  
        success : true,
        data
      }
  }

   public async updateuser(ctx: HttpContext) {
      //console.log("Inside user update")
      const validId= await checkid.validate({id:ctx.userid})
      const validData = await ctx.request.validateUsing(updateuserValidator)
      const result = await this.userDomain.updateUser(validId.id,validData)
      return {
        success : true,
        status : "user data updated successfully",
        data : result
      }
  }

  public async createuser({ request }: HttpContext) {
      const validatedData = await request.validateUsing(signupvalidator)
      const user = await this.userDomain.createUser(validatedData).catch(()=>{
        throw "Error while creating user"
      })
      return {
        success: true,
        message: 'User created successfully',
        data: user,
      }
  }

  public async deleteUser(ctx: HttpContext) {
      const validId = await checkid.validate({id :ctx.userid})
      const result = this.userDomain.deleteuser(validId.id)
      return {
        success : true,
        message: 'User deleted successfully',
        result
      }
  }

 
  public async getUserByEmail({ params}: HttpContext) {
    // try {
      const validData = await checkemail.validate(params)
      const data = await this.userDomain.getUserByEmail(validData.email)
      return {
        success : true,
        data
      }
      //const data = await User.findByOrFail('email', validData.email)
    //   return response.json({
    //     status: ' user fetched Successful',
    //     data,
    //   })
    // } catch (error) {
    //   return response.status(404).json({
    //     message: 'User not found or invalid data',
    //   })
     
  }
  public async login({ request, response }: HttpContext) {
     //try {
      //console.log(request.only(['email', 'password']))
      const data :{email : string, password :string}= await request.validateUsing(userValidatorLogin)
      //console.log(data)
     // const { email, password } = data
    //  console.log("After  error in validation")
      const res = await this.userDomain.login(data)
      return {
        success : true ,
        message : "User login successful",
        data : res
      }
      //const user = await User.findByOrFail('email', data.email)
      // .catch((err)=>{
      //     console.log("Error in findby")
      //     return response.status(400).json({
      //         success: false,
      //         message: 'Invalid email',
      //         error :err
      //       })
      //    // return response.json({message : "login validation failed ",err})
      // })     
      //if (!user) return response.status(400).json({msg:'User not found'})
      //const res = await User.verifyCredentials(data.email, data.password)
      //  .catch(()=>{
      //    console.log("Error in verification of  login")
      //     return response.status(401).json({
      //         success: false,
      //         message: 'Invalid credentials',
      //       })
  //  })
      //console.log(`user :${user}`)
      //const token = await User.accessTokens.create(user)

      // console.log(`token :${token.value!.release()}`)
      // if (!res) return 'invalid credentials'
      // //creating Jwt Token
      // const jwttoken = JwtService.sign({ id: res.id, email:data.email })
      // console.log(jwttoken)
      // return response.json({
      //   status: 'Logged in successful',
      //   jwttoken,
      //   oat: token.value!.release(),
      // })
    //  } catch (err) {
    //   return response.status(404).json({
    //      message: 'Login Failed or try after some times',
    //    })
    //  }
  }
}
