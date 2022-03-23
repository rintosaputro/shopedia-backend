const products = require('express').Router()
const productsController = require('../controllers/products')
const productImageController = require('../controllers/productImage')

products.get('/', productsController.getAllProducts)
products.post('/', productsController.createProduct)
products.delete('/:id', productsController.deleteProduct)
products.patch('/:id', productsController.updateProduct)

// Product image
products.get('/image', productsController.getProductsWithImages)
products.post('/image', productImageController.createImage)
products.delete('/image/:id', productImageController.deleteImage)
products.patch('/image/:id', productImageController.updateImage)

module.exports = products
