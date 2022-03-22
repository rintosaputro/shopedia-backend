const routes = require('express').Router()

routes.use('/products', require('./products'))

module.exports = routes
