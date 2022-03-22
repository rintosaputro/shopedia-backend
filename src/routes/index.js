const routes = require('express').Router()

routes.use('/products', require('./products'))
routes.use('/auth', require('./auth'))

module.exports = routes
