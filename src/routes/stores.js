const stores = require('express').Router()
const storesController = require('../controllers/store')

stores.get('/', storesController.getStore)
stores.post('/', storesController.createStore)
stores.patch('/:id', storesController.updateStore)
stores.delete('/:id', storesController.deleteStore)

// get stores with user
stores.get('/with-user', storesController.getStoreWithUser)

module.exports = stores
