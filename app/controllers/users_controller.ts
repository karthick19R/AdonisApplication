import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import { signupvalidator, checkid, updateuserValidator, checkemail ,userValidatorLogin } from '../validators/user.js'
import { JwtService } from '#services/jwt_service'
export default class UsersController {
  public async getdetail({ response }: HttpContext) {
      //console.log('inside getdeatil')
      const data = await User.all()
      if (data.length == 0) {
        return response.send('NO User Available')
      }
      return response.json({
        status: 'User detailed fetched successfully',
        data,
      })
  }
  public async show({ params, response }: HttpContext) {
    try {
      console.log("inside show user function")
      const validatedParams = await checkid.validate({ id: params.id })
      const user = await User.findOrFail(validatedParams.id)
      console.log(user)
      return response.json(user)
    } catch (error) {
      return response.status(404).json({
        message: 'User not found',
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(signupvalidator)
      const user = await User.create(validatedData)

      return response.status(201).json({
        status: 'successful',
        userId: user.id,
        message: 'User created successfully',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'Validation failed',
        error: error.messages ?? error,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const validId = await checkid.validate(params)
      const user = await User.findOrFail(validId.id)
      console.log("Going to delete user",user)
      await user.delete()
      return response.json({
        message: 'User deleted successfully',
      })
    } catch(err) {
      return response.status(404).json({
        success : 'failed',
        message: err,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      console.log("Inside user update")
      const validId = await checkid.validate(params)
      const user = await User.findOrFail(validId.id)
      console.log("Going to check ability of the user")
     console.log("User authorized successfully")
      const data = await request.validateUsing(updateuserValidator)

      user.merge(data)
      await user.save()

      return response.json({
        message: 'User updated successfully',
        user,
      })
    } catch {
      return response.status(404).json({
        message: 'User not found or invalid data',
      })
    }
  }

  public async getUserByEmail({ params, response }: HttpContext) {
    try {
      const validData = await checkemail.validate(params)
      const data = await User.findByOrFail('email', validData.email)
      return response.json({
        status: ' user fetched Successful',
        data,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'User not found or invalid data',
      })
    }
  }
  public async login({ request, response }: HttpContext) {
     //try {
      console.log(request.only(['email', 'password']))
      const data= await request.validateUsing(userValidatorLogin)
      //console.log(data)
     // const { email, password } = data
    //  console.log("After  error in validation")
      const user = await User.findByOrFail('email', data.email)
      // .catch((err)=>{
      //     console.log("Error in findby")
      //     return response.status(400).json({
      //         success: false,
      //         message: 'Invalid email',
      //         error :err
      //       })
      //    // return response.json({message : "login validation failed ",err})
      // })     
      if (!user) return response.status(400).json({msg:'User not found'})
      const res = await User.verifyCredentials(data.email, data.password)
       .catch(()=>{
         console.log("Error in verification of  login")
          return response.status(401).json({
              success: false,
              message: 'Invalid credentials',
            })
    })
      //console.log(`user :${user}`)
      const token = await User.accessTokens.create(user)

      console.log(`token :${token.value!.release()}`)
      if (!res) return 'invalid credentials'
      //creating Jwt Token
      const jwttoken = JwtService.sign({ id: res.id, email:data.email })
      console.log(jwttoken)
      return response.json({
        status: 'Logged in successful',
        jwttoken,
        oat: token.value!.release(),
      })
    //  } catch (err) {
    //   return response.status(404).json({
    //      message: 'Login Failed or try after some times',
    //    })
    //  }
  }
}
