import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import { signupvalidator, updateuserValidator } from '#validators/user'
import { adminIdValidator } from '#validators/adminid'
import Post from '#models/post'
export default class AdminController {
    public async index(){
        console.log("Inside admin index")
        return await Admin.all()
    }
    public async store({request}:HttpContext){
        const V_data = await request.validateUsing(signupvalidator)
        const user = await Admin.create(V_data)
        return {
            success :true,
            status :"Admin Addded Successfully",
            data : user
        }
    }
    public async update({request,response,params}:HttpContext){
        const validId = await adminIdValidator.validate(params)
        const user = await Admin.findOrFail(validId.id)
        const v_data = await request.validateUsing(updateuserValidator)
        user.merge(v_data)
        await user.save()
        return {
            success :true,
            status :"Details updated successfully",
            data : user
        }
    }
    public async destroy({params,response}:HttpContext){
        const v_id = await adminIdValidator.validate(params)
        const user = await Admin.findByOrFail(v_id)
        user.delete()
        return {
            success : true,
            status : "Deleted successfully",
        }
    }
    public async getallpost({}:HttpContext){
        return Post.all()
    }
}