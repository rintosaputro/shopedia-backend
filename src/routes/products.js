const products = require('express').Router()
const productsController = require('../controllers/products')

products.get('/', productsController.getAllProducts)
products.post('/', productsController.createProduct)
products.delete('/:id', productsController.deleteProduct)
products.patch('/:id', productsController.updateProduct)

module.exports = products
