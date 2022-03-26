const rates = require('express').Router()
const ratesController = require('../controllers/rates')

rates.post('/', ratesController.rateProduct)
rates.get('/:id', ratesController.getRateByProduct)

module.exports = rates
