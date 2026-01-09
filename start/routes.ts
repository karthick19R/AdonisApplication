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
import { middleware } from './kernel.js'
router.where('id', router.matchers.number())

router.get('/users/email/:email',[UsersController,'getUserByEmail']).
middleware([middleware.logger(), middleware.requestSizeLimiter()])
.where('email', /^[\w.-]+@[\w.-]+\.\w+$/)


router.post('/login',[UsersController,'login']).middleware([middleware.logger(), middleware.requestSizeLimiter()])
router.resource('/users', UsersController)
  .apiOnly()
  .middleware('*', [middleware.logger(), middleware.requestSizeLimiter()]).middleware(['show', 'update', 'destroy'], [middleware.jwtauthen(),middleware.authen()])


router.group(()=>{
  router.resource('/posts','#controllers/posts_controller')
  router.get('/posts/userid/:id',[postcontroller,'showbySender'])
  router.get('/posts/filter',[postcontroller,'getbydateandsender'])
}).middleware([middleware.logger(),middleware.requestSizeLimiter(),middleware.postAuthenUser()])
