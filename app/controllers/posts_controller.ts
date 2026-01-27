import { HttpContext } from '@adonisjs/core/http'
import posts from '../models/post.js'
import {
  createPostValidator,
  postupdatevalidator,
  postFilterValidator,
  checkid,
  postDeleteValidator,
} from '../validators/post.js'
import  PostDomain  from '../domains/post_domain.js'
import PostRepository from '../repositories/post_repository.js'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

export interface PostWithUsers {
  id: number
  senderid: number
  receiverid: number
  content: string
  created_at: DateTime
  updated_at: DateTime

  sender: {
    id: number 
    name: string 
  }

  receiver: {
    id: number 
    name: string 
  }
}

export default class PostsController {
  private postDomain : PostDomain
  private postRepo : PostRepository
  constructor(){
    this.postDomain = new PostDomain()
    this.postRepo = new PostRepository()
  }

  public async getposts({ auth, request }: HttpContext) {
  const page = request.input('page', 1)
  const perPage = request.input('perPage', 10)
  const paginator = await this.postRepo
    .getposts(auth.user!.id, page, perPage)
    .catch(() => {
      throw new Exception('Error while retrieving posts', { status: 400 })
    })

  const result = this.postDomain.getposts(paginator)

  return {
    success: true,
    message: 'Posts fetched successfully for the logged user',
    ...result,
  }
}


  public async update({ request,params }: HttpContext) {
 
    const Vid : {id :number}= await checkid.validate(params)
    const data :{content : string}= await request.validateUsing(postupdatevalidator)
    const res:posts= await this.postRepo.updatePost(Vid.id,data)
    const result:posts =await this.postDomain.updatePost(res)
    return {
      success : true,
      data : result
    }
  }

  public async getbydateandsender({ request }: HttpContext) {
    
      console.log('Inside getbydateandsender')
      //const qs = request.qs()
      //console.log(qs)
      const { id, date } = await request.validateUsing(postFilterValidator)
      const parsedDate = date? DateTime.fromISO(date): undefined

      const data:posts[] = await this.postRepo.getByDateAndSender(id,parsedDate).catch(()=>{
        throw new Exception("Error while fetching Posts",{status:400})
      })
      const result = this.postDomain.getbydateandsender(data).catch(()=>
      {
        throw new Exception("Error while fetching data",{status:400})
})
      return {
        success :true,
        data : result
      }
    }

  public async addpost({ bouncer,request }: HttpContext) {

      // console.log("Inside post store")
      const validateddata = await request.validateUsing(createPostValidator)
      console.log("Going to authorize")
      await bouncer.authorize('storepost',validateddata.senderid)
      return await posts.create(validateddata)
   
  }
  

  public async show({params, bouncer }: HttpContext) {
    //console.log('Inside post show by id')
    const validatedata:{id :number} = await checkid.validate(params)
    //console.log(`userid in show of post :${auth.user?.id}`)
    //console.log(params.id)
    const post:posts= await this.postRepo.show(validatedata.id).catch(()=>{
      throw new Exception("Error while fetching data",{status:400})
    })
    //const post = await posts.findByOrFail('id', id)
    //console.log('going to perform authorization')
    await bouncer.authorize('viewpost', post)
    //console.log('Authorization completed')
    const data = await this.postDomain.show(post)
    return {success:true,data}
  }

  public async showbyReceiver({params, auth }: HttpContext) {
    const validdata = await checkid.validate(params)
   const data:posts[] = await this.postRepo.showbyReceiver(auth.user!.id,validdata.id)
   const result:posts[] = await this.postDomain.showbyReceiver(data)
    return {
      success : true,
      data : result
    }
  }
  public async destroy({ params }: HttpContext) {
    //console.log('Inside destroy function')
    const data = await postDeleteValidator.validate({
      id: params.id,
    })
    //console.log(data)
    const post = await this.postRepo.destroy(data.id)
    //const post = await posts.findByOrFail('id', data.id)
    //await bouncer.authorize('editpost', post)
    return {
      success : true,
      data : "Post deleted successfully"
    }
  }
}
