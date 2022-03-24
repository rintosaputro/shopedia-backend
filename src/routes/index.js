const routes = require('express').Router()

routes.use('/products', require('./products'))
routes.use('/auth', require('./auth'))
routes.use('/roles', require('./roles'))
routes.use('/users', require('./users'))
routes.use('/stores', require('./stores'))
routes.use('/categories', require('./categories'))
routes.use('/order-status', require('./orderStatus'))
routes.use('/brands', require('./brands'))

module.exports = routes
