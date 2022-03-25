const stores = require('express').Router()
const storesController = require('../controllers/store')
const auth = require('../middlewares/auth')

stores.get('/', storesController.getStore)
stores.post('/', auth.verifySeller, storesController.createStore)
stores.patch('/', auth.verifySeller, storesController.updateStore)
stores.delete('/', auth.verifySeller, storesController.deleteStore)

// get stores with user
stores.get('/my-store', auth.verifySeller, storesController.getStoreWithUser)

module.exports = stores
