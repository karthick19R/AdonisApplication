import { HttpContext } from '@adonisjs/core/http'
import posts from '../models/post.js'
import {
  createPostValidator,
  postupdatevalidator,
  postFilterValidator,
  checkid,
  postDeleteValidator,
} from '../validators/post.js'
export default class PostsController {
  public async index({ response, auth }: HttpContext) {
    // console.log("params" , params)
    //console.log("id inside index of post" , auth.user?.id)
    const id = auth.user!.id
    const data = await posts.query().where((q) => {
      q.where('senderid', id).orWhere('receiverid', id)
    })
    return response.json({
      message: 'Posts fetched successfully for the logged user',
      data,
    })
  }
  public async update({ request, response, bouncer, params }: HttpContext) {
    //console.log('inside update post')
    //console.log("id from params :",params.id)
    const Vid = await checkid.validate(params)
    //console.log('Id verified successfully')
    const data = await request.validateUsing(postupdatevalidator)
    const post = await posts.findByOrFail(Vid)
    //console.log('Going to Authorize edit post')
    await bouncer.authorize('editpost', post)
    post.merge(data)
    post.save()
    return response.status(200).json({
      message: 'Data Updated Successfully',
    })
  }

  public async getbydateandsender({ request, response }: HttpContext) {
    try {
      console.log('Inside getbydateandsender')
      //const qs = request.qs()
      //console.log(qs)
      const { id, date } = await request.validateUsing(postFilterValidator)
      let query = posts.query()
      console.log(query)
      if (id) query = query.where('senderid', id)
        console.log("second query",query)
      if (date) query = query.whereRaw('DATE(created_at) = ?', [date])
      const data = await query
      if (data.length == 0) {
        return response.status(200).json({
          query: 'filtered by date and senderId',
          result: 'No Data',
        })
      }
      return response.status(200).json({
        query: 'filtered by date and senderId',
        result: data,
      })
    } catch (err) {
      return response.status(404).json({
        message: 'Data not found',
      })
    }
  }

  public async store({ bouncer,request }: HttpContext) {
    //try {
      console.log("Inside post store")
      const validateddata = await request.validateUsing(createPostValidator)
      console.log("Going to authorize")
      await bouncer.authorize('storepost',validateddata.senderid)
      return await posts.create(validateddata)
   // } catch (err) {
    //   return response.status(400).json({
    //     message: ' Sorry , something went wrong',
    //   })
    // }
  }

  public async show({params, bouncer }: HttpContext) {
    //console.log('Inside post show by id')
    const validatedata = await checkid.validate(params)
    //console.log(`userid in show of post :${auth.user?.id}`)
    //console.log(params.id)
    const id = params.id
    const post = await posts.findByOrFail('id', id)
    //console.log('going to perform authorization')
    await bouncer.authorize('viewpost', post)
    //console.log('Authorization completed')
    const data = await posts.find(validatedata.id)
    return data
  }

  public async showbyReceiver({ response, params, auth }: HttpContext) {
    const validdata = await checkid.validate(params)
    const data = await posts.query().where((q) => {
      q.where('senderid', auth.user!.id).where('receiverid', validdata.id)
    })
    //await bouncer.authorize('',)
    if (data.length == 0) {
      return response.json({
        message: 'Messages are fetched successfully',
        result: 'There is no message',
      })
    }
    return response.json({
      message: 'Messages are fetched successfully',
      result: data,
    })
  }

  public async destroy({ bouncer, response, params }: HttpContext) {
    console.log('Inside destroy function')
    const data = await postDeleteValidator.validate({
      id: params.id,
    })
    console.log(data)
    const post = await posts.findByOrFail('id', data.id)
    await bouncer.authorize('editpost', post)
    const result = await post.delete()
    console.log(result)
    return response.status(200).json({
      message: `User with ${data.id} is deleted`,
    })
  }
}
