import type { HttpContext } from '@adonisjs/core/http'
import group from '../models/group.js'
export default class UserGroupsController {
     public  async  showall({request}:HttpContext){
        console.log("Inside showall of UserGroupController")
        //const data =  await group.all()
        const firstdata = await group.first()
        console.log(firstdata)
        console.log(firstdata?.displayName) 
        console.log(firstdata?.displayName) 
        console.log(firstdata?.displayName)
        console.log("Trying to access getter second time")
        console.log(firstdata)
        console.log("request id :",request.id())
        return {firstdata}
    }
}