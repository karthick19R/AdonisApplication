import posts from '#models/post'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export default class PostDomain {
  public getposts(
    paginator: ModelPaginatorContract<any>
  ) {
    return {
      meta: {
        total: paginator.total,
        perPage: paginator.perPage,
        currentPage: paginator.currentPage,
        lastPage: paginator.lastPage,
      },
      data: paginator.all().map((post) => ({
        id: post.id,
        senderid: post.senderid,
        receiverid: post.receiverid,
        content: post.content,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        sender: {
          id: post.$extras.sender_id,
          name: post.$extras.sender_name,
        },
        receiver: {
          id: post.$extras.receiver_id,
          name: post.$extras.receiver_name,
        },
      })),
    }
  }

  public async updatePost(data :posts){
    return data
  }
  public async getbydateandsender(data:posts[]){
    return data
  }
  public async show(data :posts){
    return data
  }
  public async showbyReceiver(data :posts[]){
    return data
  }
  public async destroy(){
    
  }
}
