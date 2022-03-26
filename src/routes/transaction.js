const transaction = require('express').Router()

const transactionController = require('../controllers/transaction')
const orderedProductController = require('../controllers/orderedProduct')

const auth = require('../middlewares/auth')

// ordered product
transaction.get('/ordered-product', auth.verifyUser, orderedProductController.listOrderedProduct)
transaction.post('/ordered-product', auth.verifyUserConfirmed, orderedProductController.addOrderedProduct)
transaction.patch('/change-order-status/:id', auth.verifyUserConfirmed, auth.verifySeller, orderedProductController.changeOrderStatus)

// transaction
transaction.get('/', auth.verifyUser, transactionController.listTransaction)
transaction.get('/:id', auth.verifyUser, transactionController.detailTransaction)
transaction.post('/', auth.verifyUserConfirmed, transactionController.createTransaction)

module.exports = transaction
