import Post from '#models/post'
import { DateTime } from 'luxon'
export default class PostRepository {

  public async getposts(
            id: number,
            page: number,
            perPage: number) {
  return Post.query()
      .leftJoin('users as sender', 'posts.senderid', 'sender.id')
      .leftJoin('users as receiver', 'posts.receiverid', 'receiver.id')
      .select(
        'posts.*',
        'sender.id as sender_id',
        'sender.full_name as sender_name',
        'receiver.id as receiver_id',
        'receiver.full_name as receiver_name'
      )
      .where((q) => {
        q.where('posts.senderid', id).orWhere('posts.receiverid', id)
      })
      .orderBy('posts.created_at', 'desc')
      .paginate(page, perPage) 
}

  public async updatePost(id: number, data: { content: string }) {
    const post = await Post.findByOrFail({ id })
    post.merge(data)
    return post.save()
  }
  public async getByDateAndSender(id?: number, date?: DateTime) {
    const query = Post.query()

    if (id) {
      query.where('senderid', id)
    }
    if (date) {
      query.whereBetween('created_at', [
        date.startOf('day').toJSDate(),
        date.endOf('day').toJSDate(),
      ])
    }

    return query
  }
  public async show(id : number){
    return Post.query()
      .where('id', id)
      .preload('sender', (q) => q.select('id', 'fullName'))
      .preload('receiver', (q) => q.select('id', 'fullName'))
      .firstOrFail()
  }
  public async showbyReceiver(user_id : number,friend_id :number){
     return Post.query()
      .where('senderid', user_id)
      .where('receiverid', friend_id)
      .preload('sender', (q) => q.select('id', 'fullName'))
      .preload('receiver', (q) => q.select('id', 'fullName'))
  }
  public async destroy(id :number){
    const post = await Post.findByOrFail('id', id)
   await post.delete()
   return true

  }
}
