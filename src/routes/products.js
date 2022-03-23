const products = require('express').Router()
const productsController = require('../controllers/products')
const productImageController = require('../controllers/productImage')
const productReviewController = require('../controllers/productReview')

products.get('/', productsController.getAllProducts)
products.post('/', productsController.createProduct)
products.delete('/:id', productsController.deleteProduct)
products.patch('/:id', productsController.updateProduct)

// Product image
products.get('/image', productsController.getProductsWithImages)
products.post('/image', productImageController.createImage)
products.delete('/image/:id', productImageController.deleteImage)
products.patch('/image/:id', productImageController.updateImage)

// product review
products.get('/review', productsController.getProductWithReview)
products.post('/review', productReviewController.createReview)
products.delete('/review/:id', productReviewController.deleteReview)
products.patch('/review/:id', productReviewController.updateReview)

module.exports = products
