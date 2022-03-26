const brand = require('express').Router()
const brandController = require('../controllers/brands')
const { verifyAdmin } = require('../middlewares/auth')

brand.get('/', brandController.listBrands)
brand.post('/', verifyAdmin, brandController.addBrand)

module.exports = brand
