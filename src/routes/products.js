const products = require('express').Router()
const productsController = require('../controllers/products')
const productImageController = require('../controllers/productImage')
const productReviewController = require('../controllers/productReview')
const uploadImage = require('../helpers/upload')
const auth = require('../middlewares/auth')

products.get('/', productsController.getAllProducts)
products.get('/:id', productsController.getProductDetail)
products.post('/', auth.verifyUserConfirmed, auth.verifySeller, productsController.createProduct)
products.delete('/:id', auth.verifyUserConfirmed, auth.verifySeller, productsController.deleteProduct)
products.patch('/:id', auth.verifyUserConfirmed, auth.verifySeller, productsController.updateProduct)

// Product image
products.get('/image', productsController.getProductsWithImages)
products.post('/image', auth.verifyUserConfirmed, auth.verifySeller, uploadImage('image'), productImageController.createImage)
products.delete('/image/:id', auth.verifyUserConfirmed, auth.verifySeller, productImageController.deleteImage)
products.patch('/image/:id', auth.verifyUserConfirmed, auth.verifySeller, uploadImage('image'), productImageController.updateImage)

// product review
products.get('/review/:id', auth.verifyUserConfirmed, productReviewController.getReview)
products.post('/review', auth.verifyUserConfirmed, productReviewController.createReview)
products.delete('/review/:id', auth.verifyUserConfirmed, productReviewController.deleteReview)
products.patch('/review/:id', auth.verifyUserConfirmed, productReviewController.updateReview)

module.exports = products
