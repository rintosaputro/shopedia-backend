const { responseHandler } = require('../helpers/responseHandler')
const ProductImage = require('../models/productImage')
const Products = require('../models/products')

exports.createImage = async (req, res) => {
  try {
    const product = await Products.findByPk(req.body.productId)
    if (!product) {
      return responseHandler(res, 404, 'Product not found')
    }
    console.log(res.body)
    const pImage = await ProductImage.create(req.body)
    return responseHandler(res, 200, 'Image add successfully', pImage)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.deleteImage = async (req, res) => {
  try {
    const pImage = await ProductImage.findByPk(req.params.id)
    if (!pImage) {
      return responseHandler(res, 404, 'image not found')
    }
    await pImage.destroy()
    return responseHandler(res, 200, 'Image deleted successfully', pImage)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.updateImage = async (req, res) => {
  try {
    const pImage = await ProductImage.findByPk(req.params.id)
    if (!pImage) {
      return responseHandler(res, 404, 'data not found')
    }
    for (const key in req.body) {
      pImage[key] = req.body[key]
    }
    pImage.save()
    return responseHandler(res, 200, 'Update successfully', pImage)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}
