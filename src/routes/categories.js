const categories = require('express').Router()
const categoriesController = require('../controllers/categories')
const { verifyAdmin } = require('../middlewares/auth')

categories.get('/', categoriesController.listCategories)
categories.post('/', verifyAdmin, categoriesController.createCategory)

module.exports = categories
