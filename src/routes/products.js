const products = require('express').Router()
const productsController = require('../controllers/products')
const productImageController = require('../controllers/productImage')
const productReviewController = require('../controllers/productReview')
const uploadImage = require('../helpers/upload')
const auth = require('../middlewares/auth')

products.get('/', productsController.getAllProducts)
products.get('/:id', productsController.getProductDetail)
products.post('/', auth.verifySeller, productsController.createProduct)
products.delete('/:id', auth.verifySeller, productsController.deleteProduct)
products.patch('/:id', auth.verifySeller, productsController.updateProduct)

// Product image
products.get('/image', productsController.getProductsWithImages)
products.post('/image', auth.verifySeller, uploadImage('image'), productImageController.createImage)
products.delete('/image/:id', auth.verifySeller, productImageController.deleteImage)
products.patch('/image/:id', auth.verifySeller, uploadImage('image'), productImageController.updateImage)

// product review
products.get('/review', productsController.getProductWithReview)
products.post('/review', productReviewController.createReview)
products.delete('/review/:id', productReviewController.deleteReview)
products.patch('/review/:id', productReviewController.updateReview)

module.exports = products
