const {
  responseHandler
} = require('../helpers/responseHandler')
const FavoriteProducts = require('../models/favoriteProducts')
const ProductImage = require('../models/productImage')
const Products = require('../models/products')

exports.addFavoriteProduct = async (req, res) => {
  try {
    const {
      id
    } = req.user
    const {
      productId
    } = req.body

    const product = await Products.findByPk(productId)

    if (!product) {
      return responseHandler(res, 404, 'Product not found')
    }

    const isDuplicate = await FavoriteProducts.findOne({
      where: {
        userId: id,
        productId
      }
    })

    if (isDuplicate) {
      return responseHandler(res, 400, 'Product already in favorite')
    }

    const results = await FavoriteProducts.create({
      userId: id,
      productId
    })

    return responseHandler(res, 200, 'Product added to favorite', results)
  } catch (err) {
    const error = err.errors.map(err => ({
      field: err.path,
      message: err.message
    }))
    if (error) {
      return responseHandler(res, 500, 'Error while add favorite product', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.getFavoriteProducts = async (req, res) => {
  try {
    const {
      id
    } = req.user

    const includes = [{
        model: Products,
        attributes: ['id', 'name', 'price', 'stock']
      },
      {
        model: ProductImage,
        attributes: ['id', 'image']
      }
    ]
    const results = await FavoriteProducts.findAll({
      where: {
        userId: id
      },
      attributes: ['id', 'userId'],
      include: includes
    })

    if (!results.length) {
      return responseHandler(res, 404, 'There is no favorite product')
    }

    return responseHandler(res, 200, 'Favorite products', results)
  } catch (err) {
    if (!err.errors) {
      console.log(err)
      return responseHandler(res, 500, 'Unexpected error')
    }

    const error = err.errors.map(err => ({
      field: err.path,
      message: err.message
    }))
    if (error) {
      return responseHandler(res, 500, 'Error while add favorite product', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.deleteFavoriteProduct = async (req, res) => {
  try {
    const {
      id
    } = req.user
    const {
      id: favoriteProductId
    } = req.params

    if (!favoriteProductId) {
      return responseHandler(res, 400, 'Invalid id of favorite product')
    }

    const results = await FavoriteProducts.findOne({
      where: {
        id: favoriteProductId,
        userId: id
      },
      include: [{
        model: Products,
        attributes: ['id', 'name', 'price', 'stock']
      }]
    })

    if (results) {
      results.destroy()
      return responseHandler(res, 200, 'Product deleted from favorite', results)
    } else {
      return responseHandler(res, 404, 'Favorite product not found')
    }
  } catch (err) {
    if (!err.errors) {
      console.error(err)
      return responseHandler(res, 500, 'Unexpected error')
    }

    const error = err.errors.map(err => ({
      field: err.path,
      message: err.message
    }))
    return responseHandler(res, 500, 'Error while delete favorite product', null, error)
  }
}
