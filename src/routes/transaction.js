const transaction = require('express').Router()

const transactionController = require('../controllers/transaction')
const orderedProductController = require('../controllers/orderedProduct')

const auth = require('../middlewares/auth')

transaction.get('/', auth.verifyUser, transactionController.listTransaction)
transaction.post('/', auth.verifyUserConfirmed, transactionController.createTransaction)

// ordered product
transaction.get('/ordered-product', auth.verifyUser, orderedProductController.listOrderedProduct)
transaction.post('/ordered-product', auth.verifyUserConfirmed, orderedProductController.addOrderedProduct)

module.exports = transaction
