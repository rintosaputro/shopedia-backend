const { cloudPathToFileName } = require('../helpers/converter')
const { deleteFile } = require('../helpers/fileHandler')
const { responseHandler } = require('../helpers/responseHandler')
const ProductImage = require('../models/productImage')
const Products = require('../models/products')

exports.createImage = async (req, res) => {
  try {
    const { path } = req.file
    const { productId } = req.body
    const product = await Products.findByPk(productId)
    if (!product) {
      if (req.file) {
        deleteFile(req.file.filename)
      }
      return responseHandler(res, 404, 'Product not found')
    }
    const data = {
      image: path,
      productId: productId
    }
    const pImage = await ProductImage.create(data)
    return responseHandler(res, 200, 'Image add successfully', pImage)
  } catch (err) {
    if (req.file) {
      deleteFile(req.file.filename)
    }
    const error = err
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
    const filename = cloudPathToFileName(pImage.image)
    deleteFile(filename)
    await pImage.destroy()
    return responseHandler(res, 200, 'Image deleted successfully', pImage)
  } catch (err) {
    const error = err
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
      if (req.file) {
        deleteFile(req.file.filename)
      }
      return responseHandler(res, 404, 'data not found')
    }
    const filename = cloudPathToFileName(pImage.image)
    deleteFile(filename)
    if (req.file) {
      pImage.image = req.file.path
    }
    pImage.save()
    return responseHandler(res, 200, 'Update successfully', pImage)
  } catch (err) {
    if (req.file) {
      deleteFile(req.file.filename)
    }
    const error = err
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}
