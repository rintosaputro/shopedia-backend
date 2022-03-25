const { responseHandler, pageInfoCreator } = require('../helpers/responseHandler')
const OrderedProducts = require('../models/orderedProduct')
const Products = require('../models/products')
const Transactions = require('../models/transactions')
const ProductImage = require('../models/productImage')
const OrderStatus = require('../models/orderStatus')

const Sequelize = require('sequelize')
const validator = require('validator')

exports.listOrderedProduct = async (req, res) => {
  try {
    const { id } = req.user

    const { orderStatusId } = req.query
    let { page, limit } = req.query

    const where = {
      userId: id
    }

    if (orderStatusId) {
      if (validator.isInt(orderStatusId)) {
        where.orderStatusId = {
          [Sequelize.Op.eq]: Number(orderStatusId)
        }
      } else {
        return responseHandler(res, 400, 'Order status must be integer')
      }
    }

    page = parseInt(page) || 1
    limit = parseInt(limit) || 5

    const offset = (page - 1) * limit

    const include = [
      {
        model: Products,
        as: 'product',
        attributes: ['id', 'name', 'price'],
        include: [{
          model: ProductImage,
          attributes: ['id', 'image'],
          limit: 1
        }]
      },
      {
        model: OrderStatus,
        attributes: ['id', 'name']
      }
    ]

    const { count, rows } = await OrderedProducts.findAndCountAll({
      where,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'orderStatusId', 'productId']
      },
      include,
      limit,
      offset
    })

    if (!rows.length) {
      return responseHandler(res, 404, 'Ordered product not found')
    }

    const data = {
      ...req.query,
      page,
      limit
    }

    const path = req.originalUrl.split('?')[0]
    const pageInfo = pageInfoCreator(count, path, data)

    return responseHandler(res, 200, 'List ordered product', rows, null, pageInfo)

    // return responseHandler(res, 200, 'Not implemented yet')
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
      return responseHandler(res, 400, 'You must provide registered input data')
    } else {
      return responseHandler(res, 500, 'Error while get ordered product')
    }
  }
}

exports.addOrderedProduct = async (req, res) => {
  try {
    const { qty, productId, transactionId } = req.body
    const data = {
      qty,
      productId,
      transactionId,
      orderStatusId: 1
    }

    const { id: userId } = req.user
    data.userId = userId

    const product = await Products.findByPk(productId)

    if (!product) {
      return responseHandler(res, 400, 'Product not found')
    }

    const transaction = await Transactions.findOne({
      where: {
        id: transactionId,
        userId
      }
    })

    if (!transaction) {
      return responseHandler(res, 400, 'Transaction not found')
    }

    data.total = Number(product.price) * Number(qty)

    const orderedProduct = await OrderedProducts.create(data)

    transaction.total = Number(transaction.total) + Number(orderedProduct.total)
    await transaction.save()

    // return responseHandler(res, 200, 'Ordered product added')
    return responseHandler(res, 200, 'Ordered product added', orderedProduct)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
      return responseHandler(res, 400, 'You must provide registered input data')
    } else {
      return responseHandler(res, 500, 'Error while add ordered product')
    }
  }
}
