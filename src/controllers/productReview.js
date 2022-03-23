const { responseHandler } = require('../helpers/responseHandler')
const ProductReview = require('../models/productReview')
const Products = require('../models/products')
const Users = require('../models/users')

exports.createReview = async (req, res) => {
  try {
    const user = await Users.findByPk(req.body.userId)
    if (!user) {
      return responseHandler(res, 404, 'User not found')
    }
    const product = await Products.findByPk(req.body.productId)
    if (!product) {
      return responseHandler(res, 404, 'Product not found')
    }
    const pReview = await ProductReview.create(req.body)
    return responseHandler(res, 200, 'Review Created', pReview)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const review = await ProductReview.findByPk(req.params.id)
    if (!review) {
      return responseHandler(res, 404, 'Data not found')
    }
    await review.destroy()
    return responseHandler(res, 200, 'Review Deleted', review)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.updateReview = async (req, res) => {
  try {
    const pReview = await ProductReview.findByPk(req.params.id)
    if (!pReview) {
      return responseHandler(res, 404, 'Data not found')
    }
    for (const key in req.body) {
      pReview[key] = req.body[key]
    }
    await pReview.save()
    return responseHandler(res, 200, 'Review Updated', pReview)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}