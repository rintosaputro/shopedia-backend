const brand = require('express').Router()
const brandController = require('../controllers/brands')

brand.get('/', brandController.listBrands)
brand.post('/', brandController.addBrand)

module.exports = brand
