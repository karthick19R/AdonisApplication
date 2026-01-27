import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'
import User from '#models/user'

export default class PostSeeder extends BaseSeeder {
  public async run () {
    const users = await User.all()
    const userIds = users.map(u => u.id)
    const postsData = [
      {
        senderid: userIds[0],
        receiverid: userIds[1],
        content: 'Hello! How are you?',
      },
      {
        senderid: userIds[1],
        receiverid: userIds[0],
        content: 'I am fine, thanks!',
      },
      {
        senderid: userIds[0],
        receiverid: userIds[1],
        content: 'Are you coming to the meeting?',
      },
      {
        senderid: userIds[1],
        receiverid: userIds[0],
        content: 'Yes, I will be there at 3 PM.',
      },
      {
        senderid: userIds[4],
        receiverid: userIds[1],
        content: 'Hey Guys.',
      },
      {
        senderid: userIds[1],
        receiverid: userIds[4],
        content: 'Hello, Whats your problem',
      },
      {
        senderid: userIds[4],
        receiverid: userIds[1],
        content: 'Nothing',
      },
    ]

    // Step 3: insert posts into database
    await Post.createMany(postsData)
    console.log('Posts seeded successfully!')
  }
}
