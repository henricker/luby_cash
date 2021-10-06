import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'PixesController.store')
  })
    .prefix('/pixes')
    .middleware(['authCustomer'])

  Route.post('/', 'CustomerController.store')
  Route.post('/session', 'SessionController.storeCustomer')
}).prefix('/customers')

Route.group(() => {
  Route.patch('/', 'ForgotPasswordController.storeAdmin')
  Route.patch('/recovery', 'ForgotPasswordController.updateAdmin')
}).prefix('/forgot-password')

Route.group(() => {
  Route.get('/', 'AdminsController.index')
  Route.post('/', 'AdminsController.store')
  Route.delete('/:adminId', 'AdminsController.destroy')
  Route.put('/:adminId', 'AdminsController.update')

  Route.group(() => {
    Route.get('/', 'CustomerController.index')
    Route.get('/:cpf', 'CustomerController.show')
    Route.group(() => {
      Route.get('/', 'PixesController.index')
    }).prefix('/:customerCPF/pixes')
  })
    .prefix('/customers')
    .middleware(['auth'])
  Route.post('/session', 'SessionController.storeAdmin')
}).prefix('/admins')
