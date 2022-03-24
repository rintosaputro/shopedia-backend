const { responseHandler } = require('../helpers/responseHandler')
const Products = require('../models/products')
const ProductImage = require('../models/productImage')
const ProductReview = require('../models/productReview')
const Sequelize = require('sequelize')
const { pageInfo } = require('../helpers/pageInfo')
const { dinamisUrl } = require('../helpers/dinamisUrl')

exports.getAllProducts = async (req, res) => {
  try {
    const { search = '' } = req.query
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    const offset = (page - 1) * limit
    const { count, rows } = await Products.findAndCountAll({
      where: {
        name: {
          [Sequelize.Op.like]: `${search}%`
        }
      },
      offset: offset,
      limit: limit
    })
    const url = dinamisUrl(req.query)
    const pInfo = pageInfo(count, limit, page, url, 'products')
    if (rows.length > 0) {
      return responseHandler(res, 200, 'List all products', rows, pInfo)
    } else {
      return responseHandler(res, 404, 'Data not found')
    }
  } catch (err) {
    console.log(err)
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
    await product.save()
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

exports.getProductsWithImages = async (req, res) => {
  try {
    const product = await Products.findAll({
      include: ProductImage
    })
    if (!product) {
      return responseHandler(res, 404, 'Data not found')
    }
    return responseHandler(res, 200, 'List Product with image', product)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.getProductWithReview = async (req, res) => {
  try {
    const product = await Products.findAll({
      include: ProductReview
    })
    if (!product) {
      return responseHandler(res, 404, 'Data not found')
    }
    return responseHandler(res, 200, 'product with review', product)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}
