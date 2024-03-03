/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = await import('#controllers/users_controller')
const CustomersController = await import('#controllers/customers_controller')
const ProductsController = await import('#controllers/products_controller')
const SalesController = await import('#controllers/sales_controller')

router.get('/', async () => {
  return {
    status: 'online',
  }
})

router
  .group(() => {
    router.post('/signup', [UsersController.default, 'signup'])
    router.post('/login', [UsersController.default, 'login'])
  })
  .prefix('/users')

router
  .group(() => {
    router.get('/', [CustomersController.default, 'index'])
    router.get('/:id', [CustomersController.default, 'show'])
    router.post('/', [CustomersController.default, 'store'])
    router.put('/:id', [CustomersController.default, 'update'])
    router.delete('/:id', [CustomersController.default, 'delete'])
  })
  .prefix('/customers')

router
  .group(() => {
    router.get('/', [ProductsController.default, 'index'])
    router.get('/:id', [ProductsController.default, 'show'])
    router.post('/', [ProductsController.default, 'store'])
    router.put('/:id', [ProductsController.default, 'update'])
    router.delete('/:id', [ProductsController.default, 'delete'])
  })
  .prefix('/products')

router
  .group(() => {
    router.post('/', [SalesController.default, 'store'])
  })
  .prefix('/sales')
