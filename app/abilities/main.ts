/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/
import { Bouncer } from '@adonisjs/bouncer'
import User from '#models/user'
import Post from '#models/post'
/**
 * Delete the following ability to start from
 * scratch
 */
export const editpost = Bouncer.ability((user :User,post:Post) => {
  console.log("inside edituser ability")
  return user.id == post.senderid 
})
export const viewpost = Bouncer.ability((user :User,post :Post)=>{
  console.log("Inside viewpost ability")
  //console.log(post.senderid )
  //console.log(user.id)
  //console.log(post.receiverid)
  return user.id == post.senderid || user.id == post.receiverid
})
export const storepost = Bouncer.ability((user:User,id:number)=>{
  console.log("Inside viewpost ability")
  return user.id==id
})
