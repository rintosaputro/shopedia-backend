const routes = require('express').Router()

routes.use('/products', require('./products'))
routes.use('/auth', require('./auth'))
routes.use('/roles', require('./roles'))

module.exports = routes
