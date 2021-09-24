import Route from '@ioc:Adonis/Core/Route'

Route.post('/session', 'SessionController.store')

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'PixesController.store')
  })
    .prefix('/pixes')
    .middleware(['auth'])

  Route.post('/', 'UsersController.store')
}).prefix('/users')

Route.group(() => {
  Route.patch('/', 'ForgotPasswordController.store')
  Route.patch('/recovery', 'ForgotPasswordController.update')
}).prefix('/forgot-password')

Route.group(() => {
  Route.get('/', 'AdminsController.index')
  Route.patch('/promote/:userId', 'AdminsController.promote')
  Route.patch('/demote/:userId', 'AdminsController.demote')
  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.group(() => {
      Route.get('/', 'PixesController.index')
    }).prefix('/:userId/pixes')
  }).prefix('/users')
})
  .prefix('/admins')
  .middleware(['auth', 'authAdmin'])
