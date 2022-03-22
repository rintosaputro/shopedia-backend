const products = require('express').Router()
const productsController = require('../controllers/products')

products.get('/', productsController.getAllProducts)

module.exports = products
