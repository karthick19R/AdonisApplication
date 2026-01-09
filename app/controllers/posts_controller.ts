import type { HttpContext } from '@adonisjs/core/http'
import posts from '../models/post.js'
import { createPostValidator, postFilterValidator,checkid,postDeleteValidator } from '../validators/post.js'
export default class PostsController {
  public async index() {
    // try{
    return await posts.all()
    // }
    // catch(err){
    //     console.log(`error ${err}`)
    //     console.log(err.code)
    //    return  response.status(503).json({messages:" Database Failed "})
    // }
  }
  public async getbydateandsender({ request, response }: HttpContext) {
    const qs = request.qs()
    console.log(qs)
    const { id, date } = await request.validateUsing(postFilterValidator)

    let query = posts.query()

    if (id) query = query.where('senderid', id)
    if (date) query = query.whereRaw('DATE(created_at) = ?', [date])
    const data = await query
    if (data.length === 0) {
      return response.status(200).json({
        query: 'filtered by date and senderId',
        result: 'No Data',
      })
    }
    return response.status(200).json({
      query: 'filtered by date and senderId',
      result: data,
    })
  }

  public async store({ request }: HttpContext) {
    const validateddata = await request.validateUsing(createPostValidator)
    return await posts.create(validateddata)
  }

  public async show({ params }: HttpContext) {
    console.log("Inside post show by id")
    const validatedata = await checkid.validate(params)
    const data = await posts.find(validatedata.id)
    return data
  }

  public async showbySender({ response,params }: HttpContext) {
    const validdata = await  checkid.validate(params)
    const data = await posts.query().where('senderid', validdata.id)
    if(data.length === 0){
        return response.json({
        message : "Messages are fetched successfully",
        result :  "There is no message"
    })
    }
    return response.json({
        message : "Messages are fetched successfully",
        result :  data
    })
  }

  public async destroy({response,params} : HttpContext){
    console.log("Inside destroy function")
    const data  = await postDeleteValidator.validate({
        id : params.id
    })
    console.log(data)
    const user = await posts.findByOrFail('id',data.id);
    const result = await user.delete()
    console.log(result)
    return response.status(200).json({
        message : `User with ${data.id} is deleted`
    })
  }
}
