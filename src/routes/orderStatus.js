const orderStatus = require('express').Router()
const orderStatusController = require('../controllers/orderStatus')
const { verifyAdmin } = require('../middlewares/auth')

orderStatus.get('/', orderStatusController.orderStatusList)
orderStatus.post('/', verifyAdmin, orderStatusController.addOrderStatus)

module.exports = orderStatus
