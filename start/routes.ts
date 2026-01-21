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
//router.where('id', router.matchers.number())
router.get('/user/group/all', [UserGroupsController, 'showall'])
// router.get('/users/email/:email',[UsersController,'getUserByEmail']).
//          middleware([middleware.logger(), middleware.requestSizeLimiter()])
//         .where('email', /^[\w.-]+@[\w.-]+\.\w+$/)

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

// router.resource('/users', UsersController)
//     .apiOnly()
//     .middleware('*', [middleware.logger(), middleware.requestSizeLimiter()])
//     .middleware(['show', 'update', 'destroy'], [middleware.jwtauthen(),middleware.authen()])

router
  .group(() => {
    router.group(()=>{
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
    

    // router.get('/user',[UsersController,'getdetail']).middleware([middleware.jwtauthen])
    // router.put('/user',[UsersController,'putdetail'])
    //.where('email', /^[\w.-]+@[\w.-]+\.\w+$/)
    // router.resource('/users', UsersController)
    //  .apiOnly()
    //  .middleware('*', [middleware.logger(), middleware.requestSizeLimiter()])
    // .middleware(['*'],[middleware.jwtauthen(),middleware.authen()])
  })
  .middleware([middleware.logger(), middleware.requestSizeLimiter()])

router
  .group(() => {
    router.get('/posts/userid/:id', [postcontroller, 'showbyReceiver'])
    router.resource('/posts', '#controllers/posts_controller')
    router.get('/posts/filter/', [postcontroller, 'getbydateandsender'])
  })
  .middleware([middleware.logger(), middleware.requestSizeLimiter(), middleware.postAuthenUser()])
  .where('id', router.matchers.number())
