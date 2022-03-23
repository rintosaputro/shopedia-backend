const routes = require('express').Router()

routes.use('/products', require('./products'))
routes.use('/auth', require('./auth'))
routes.use('/roles', require('./roles'))
routes.use('/users', require('./users'))

module.exports = routes
