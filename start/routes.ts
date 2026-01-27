/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import postcontroller from '#controllers/posts_controller'
import AdminController from '#controllers/admin_controller'
import UserGroupsController from '#controllers/user_groups_controller'
import { middleware } from './kernel.js'

router.group(() => {
  router.get('/admin/posts', [AdminController, 'getallpost'])
  router
    .resource('/admin', AdminController)
    .apiOnly()
    .middleware('*', [middleware.logger(), middleware.requestSizeLimiter()])
})

router
  .post('/login', [UsersController, 'login'])
  .middleware([middleware.logger(), middleware.requestSizeLimiter()])

router
  .group(() => {
    router.group(()=>{
      router.get('group/all', [UserGroupsController, 'showall'])
      router.get('/email/:email',[UsersController,'getUserByEmail'])
    }).prefix('/user')
    router
      .group(() => {
        router.get('/user', [UsersController, 'getdetail'])
        router.put('/user', [UsersController, 'updateuser'])
        router.delete('/user',[UsersController,'deleteUser'])
      })
      .middleware([middleware.jwtauthen()])
    router.post('/user', [UsersController, 'createuser'])
    
  })
  .middleware([middleware.logger(), middleware.requestSizeLimiter()])

router
  .group(() => {
    router.get('/posts/userid/:id', [postcontroller, 'showbyReceiver'])
    //router.resource('/posts', '#controllers/posts_controller')
    router.get('/post',[postcontroller,'getposts'])
    router.put('/post',[postcontroller,'update'])
    router.post('/post',[postcontroller,'addpost'])
    router.get('/post/id',[postcontroller,'show'])
    router.delete('/post',[postcontroller,'destroy'])
    router.get('/posts/filter/', [postcontroller, 'getbydateandsender'])
  })
  .middleware([middleware.logger(), middleware.requestSizeLimiter(), middleware.postAuthenUser()])
  .where('id', router.matchers.number())

