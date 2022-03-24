const paymentMethod = require('express').Router()
const paymentMethodController = require('../controllers/paymentMethod')

const auth = require('../middlewares/auth')

paymentMethod.get('/', paymentMethodController.paymentMethodList)
paymentMethod.post('/', auth.verifyAdmin, paymentMethodController.addPaymentMethod)
paymentMethod.delete('/:id', auth.verifyAdmin, paymentMethodController.deletePaymentMethod)

module.exports = paymentMethod
