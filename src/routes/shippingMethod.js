const shippingMethods = require('express').Router()
const shippingMethodController = require('../controllers/shippingMethod')

shippingMethods.get('/', shippingMethodController.listShippingMethods)

module.exports = shippingMethods
