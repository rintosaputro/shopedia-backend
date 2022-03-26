const transaction = require('express').Router()

const transactionController = require('../controllers/transaction')
const orderedProductController = require('../controllers/orderedProduct')

const auth = require('../middlewares/auth')

// ordered product general
transaction.delete('/ordered-product/:id', auth.verifyUserConfirmed, orderedProductController.deleteOrderedProduct)

// ordered product user
transaction.get('/ordered-product', auth.verifyUser, orderedProductController.listOrderedProduct)
transaction.post('/ordered-product', auth.verifyUserConfirmed, orderedProductController.addOrderedProduct)

// ordered product for seller
transaction.patch('/ordered-product/:id', auth.verifyUserConfirmed, auth.verifySeller, orderedProductController.changeOrderStatus)
transaction.get('/ordered-product/seller', auth.verifyUserConfirmed, auth.verifySeller, orderedProductController.listOrderedProductSeller)

// transaction
transaction.get('/', auth.verifyUser, transactionController.listTransaction)
transaction.get('/:id', auth.verifyUser, transactionController.detailTransaction)
transaction.post('/', auth.verifyUserConfirmed, transactionController.createTransaction)

module.exports = transaction
