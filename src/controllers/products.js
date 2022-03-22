const { responseHandler } = require('../helpers/responseHandler')
const Products = require('../models/products')

exports.getAllProducts = async (req, res) => {
  try {
    const results = await Products.findAll()
    if (results) {
      return responseHandler(res, 200, 'List all products', results)
    } else {
      return responseHandler(res, 404, 'Data not found')
    }
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.createProduct = async (req, res) => {
  try {
    const results = await Products.create(req.body)
    return responseHandler(res, 200, 'Product Created!', results)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id)
    if (product) {
      product.destroy()
      return responseHandler(res, 200, 'Deleted Successfully', product)
    } else {
      return responseHandler(res, 404, 'Data not found')
    }
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id)
    if (!product) {
      return responseHandler(res, 404, 'Data not found')
    }
    for (const key in req.body) {
      product[key] = req.body[key]
    }
    product.save()
    return responseHandler(res, 200, 'Update Successfully', product)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}