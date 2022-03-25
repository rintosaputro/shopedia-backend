const {
  responseHandler
} = require('../helpers/responseHandler')
const Category = require('../models/categories')

exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()
    responseHandler(res, 200, 'List categories', categories)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error while listing categories')
  }
}

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body

    const category = await Category.create({
      name
    })

    if (category) {
      return responseHandler(res, 200, 'Category created successfully', category)
    }
  } catch (err) {
    console.error(err)

    if (err.name === 'SequelizeUniqueConstraintError') {
      return responseHandler(res, 400, 'Category already used')
    }

    return responseHandler(res, 500, 'Error while creating category')
  }
}
