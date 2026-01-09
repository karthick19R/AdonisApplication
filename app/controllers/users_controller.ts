import { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';
import {signupvalidator,checkid, updateuserValidator,checkemail} from '../validators/user.js'
import { messages } from '@vinejs/vine/defaults';
import {JwtService} from '#services/jwt_service'
export default class UsersController {
    public async index({response}:HttpContext){
        console.log("inside index");
        const data = await  User.all();
        if(data.length == 0) {
            return response.send("NO User Available")
        }
        //console.log(data)
       return response.json({
        status : "User detailed fetched successfully",
        data})
    }
    public async show({params} : HttpContext){
        console.log(`inside show ${params.id}`);
        const validatedParams = await checkid.validate({
        id: (params.id) 
            });
        console.log(params,"going to fetch user data")
       // console.log(`full httpcontext :${HttpContext}`)
        return await User.findOrFail(validatedParams.id);
    }
    public async store({request,response}: HttpContext){
        console.log("inside store")
        const validatedate = await request.validateUsing(signupvalidator)
         //const data = {}
        console.log(validatedate)
        
        const user =await User.create(validatedate)
        return  response.json({
            status : "successful",
            userid : user.id,
            message : "User created successfull"
        })
    }
    public async destroy({params}:HttpContext){
        const user = await User.findByOrFail('id',params.id)
        await user.delete()
        return {"message" : "User Deleted Successfully"}
    }
    public async update({ params , request } : HttpContext){
        const validid = await checkid.validate(params)
        const user  = await User.findOrFail(validid.id);
        const data =await request.validateUsing(updateuserValidator)
       
        // data.fullName = data.fullName ?? user.fullName
        // data.email = data.email ?? user.email
        user.merge(data)
        await user.save()
        return {"message" : "user updated successfully" , user}
    }
    public async getUserByEmail({params,response} :HttpContext){
        const validData = await checkemail.validate(params)
        const data = await User.findByOrFail("email" , validData.email)
        return response.json({
            status : " user fetched Successful",
            data
        })
    }
    public async login({request,response} :HttpContext){
        console.log(request.only(['email','password']));
        const { email,password } = request.only(['email','password'])
        const user = await User.findBy('email',email)
        if(!user)return "User not found"
        const res= await User.verifyCredentials(email,password)
       // console.log(res.id)
        if(!res) return "invalid credentials"
        const token = JwtService.sign({id : res.id ,email})
        console.log(token)
        return response.json({status :"Logged in successful",token}) 
    }
    
}