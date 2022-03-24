const user = require('express').Router()

const favoriteProduct = require('../controllers/favoriteProduct')
const userController = require('../controllers/users')
const uploadImage = require('../helpers/upload')
const auth = require('../middlewares/auth')

// User profile
user.get('/profile', auth.verifyUser, userController.getProfile)
user.patch('/profile', auth.verifyUser, uploadImage('image'), userController.updateProfile)

// User favorite product
user.get('/favorite-product', auth.verifyUser, favoriteProduct.getFavoriteProducts)
user.post('/favorite-product', auth.verifyUser, favoriteProduct.addFavoriteProduct)
user.delete('/favorite-product/:id', auth.verifyUser, favoriteProduct.deleteFavoriteProduct)

module.exports = user
