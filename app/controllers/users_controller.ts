import { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import { signupvalidator, checkid, updateuserValidator, checkemail } from '../validators/user.js'
import { JwtService } from '#services/jwt_service'
export default class UsersController {
  public async index({ response }: HttpContext) {
    try {
      console.log('inside index')
      const data = await User.all()
      if (data.length == 0) {
        return response.send('NO User Available')
      }
      return response.json({
        status: 'User detailed fetched successfully',
        data,
      })
    } catch (err) {
      console.log('Error in index function')
      return response.json('Sorry,Some Error in fetching Data')
    }
  }
  public async show({ params, response }: HttpContext) {
    try {
      console.log("inside show user function")
      const validatedParams = await checkid.validate({ id: params.id })
      const user = await User.findOrFail(validatedParams.id)
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

      await user.delete()

      return response.json({
        message: 'User deleted successfully',
      })
    } catch {
      return response.status(404).json({
        message: 'User not found',
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
    try {
      console.log(request.only(['email', 'password']))
      const { email, password } = request.only(['email', 'password'])
      const user = await User.findBy('email', email)
      if (!user) return 'User not found'
      const res = await User.verifyCredentials(email, password)
      //console.log(`user :${user}`)
      const token = await User.accessTokens.create(user)

      console.log(`token :${token.value!.release()}`)
      if (!res) return 'invalid credentials'
      //creating Jwt Token
      const jwttoken = JwtService.sign({ id: res.id, email })
      console.log(jwttoken)
      return response.json({
        status: 'Logged in successful',
        jwttoken,
        oat: token.value!.release(),
      })
    } catch (err) {
      return response.status(404).json({
        message: 'Login Failed or try after some times',
      })
    }
  }
}
