const { responseHandler, pageInfoCreator } = require('../helpers/responseHandler')
const OrderedProducts = require('../models/orderedProduct')
const Products = require('../models/products')
const Transactions = require('../models/transactions')
const ProductImage = require('../models/productImage')
const OrderStatus = require('../models/orderStatus')

const Sequelize = require('sequelize')
const validator = require('validator')
const Users = require('../models/users')
const Roles = require('../models/roles')

exports.listOrderedProduct = async (req, res) => {
  try {
    const { id } = req.user

    const { orderStatusId } = req.query
    let { page, limit } = req.query

    const where = {
      userId: id,
      deletedAt: null
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

    const transaction = await Transactions.findOne({
      where: {
        id: transactionId,
        userId
      }
    })

    if (!transaction) {
      return responseHandler(res, 400, 'Transaction not found')
    }

    const product = await Products.findByPk(productId)
    const user = await Users.findByPk(userId)

    if (!product) {
      return responseHandler(res, 400, 'Product not found')
    }

    if (user.storeId === product.storeId) {
      return responseHandler(res, 400, 'You can not order your own product')
    }

    data.storeId = product.storeId

    if (product.stock < qty) {
      return responseHandler(res, 400, 'Stock not enough')
    }

    data.total = Number(product.price) * Number(qty)

    const isAlreadyOrdered = await OrderedProducts.findOne({
      where: {
        productId,
        transactionId
      }
    })

    let orderedProduct

    if (isAlreadyOrdered) {
      orderedProduct = await OrderedProducts.findByPk(isAlreadyOrdered.id)
      // console.log(orderedProduct)
      orderedProduct.qty += Number(qty)
      orderedProduct.total += data.total
      await orderedProduct.save()
    } else {
      orderedProduct = await OrderedProducts.create(data)
    }

    transaction.total = Number(transaction.total) + Number(data.total)
    product.stock = Number(product.stock) - Number(qty)
    console.log('naga', product.stock)
    await transaction.save()
    await product.save()

    const orderDetail = await OrderedProducts.findByPk(orderedProduct.id, {
      include: [
        {
          model: Products,
          attributes: ['id', 'name', 'price', 'stock']
        },
        {
          model: OrderStatus,
          attributes: ['id', 'name']
        }
      ]
    })

    // return responseHandler(res, 200, 'Ordered product added')
    return responseHandler(res, 200, 'Ordered product added', orderDetail)
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

exports.changeOrderStatus = async (req, res) => {
  try {
    const { id: orderedProductId } = req.params
    const { orderStatusId } = req.body
    const { id: userId } = req.user

    const orderedProduct = await OrderedProducts.findByPk(orderedProductId, {
      include: [
        {
          model: Products,
          attributes: ['id', 'name', 'price', 'stock', 'storeId']
        },
        {
          model: OrderStatus,
          attributes: ['id', 'name']
        }
      ],
      attributes: {
        exclude: ['productId', 'transactionId']
      }
    })

    if (!orderedProduct) {
      return responseHandler(res, 400, 'Ordered product not found')
    }

    const orderStatus = await OrderStatus.findByPk(orderStatusId)

    if (!orderStatus) {
      return responseHandler(res, 400, 'Order status not found')
    }

    const seller = await Users.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'storeId']
    })

    const store = seller.storeId
    const productStore = orderedProduct.product.storeId

    if (store !== productStore) {
      return responseHandler(res, 400, 'Just seller of this product can change order status')
    }

    if (orderedProduct.orderStatusId === Number(orderStatusId)) {
      return responseHandler(res, 400, 'Order status already same')
    }
    // console.log(orderedProduct.product.storeId)
    // console.log(orderedProduct.orderStatusId)

    orderedProduct.orderStatusId = Number(orderStatusId)
    await orderedProduct.save()

    const newOrderedProduct = await OrderedProducts.findByPk(orderedProduct.id, {
      include: [
        {
          model: Products,
          attributes: ['id', 'name', 'price', 'stock', 'storeId']
        },
        {
          model: OrderStatus,
          attributes: ['id', 'name']
        }
      ],
      attributes: {
        exclude: ['productId']
      }
    })

    return responseHandler(res, 200, 'Order status changed', newOrderedProduct)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
      return responseHandler(res, 400, 'You must provide registered input data')
    } else {
      return responseHandler(res, 500, 'Error while change order status')
    }
  }
}

exports.listOrderedProductSeller = async (req, res) => {
  try {
    const { id: userId } = req.user

    const { orderStatusId } = req.query
    let { page, limit } = req.query

    const seller = await Users.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'storeId']
    })

    const { storeId } = seller
    console.log(storeId)

    const where = {
      storeId
    }

    if (orderStatusId) {
      where.orderStatusId = orderStatusId
    }

    const include = [
      {
        model: Products,
        as: 'product',
        attributes: ['id', 'name', 'price', 'stock', 'storeId'],
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

    page = parseInt(page) || 1
    limit = parseInt(limit) || 10

    const offset = (page - 1) * limit

    const { rows, count } = await OrderedProducts.findAndCountAll({
      where,
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt']
      },
      include,
      limit,
      offset
    })

    if (!rows.length) {
      return responseHandler(res, 404, 'No ordered product found')
    }

    const data = {
      ...req.query,
      page,
      limit
    }

    const path = req.originalUrl.split('?')[0]
    const pageInfo = pageInfoCreator(count, path, data)

    return responseHandler(res, 200, 'Ordered product list', rows, null, pageInfo)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else {
      return responseHandler(res, 500, 'Error while get ordered product')
    }
  }
}

exports.deleteOrderedProduct = async (req, res) => {
  try {
    const { id: orderedProductId } = req.params
    const { id: userId } = req.user

    const user = await Users.findByPk(userId, {
      include: [
        {
          model: Roles,
          attributes: ['id', 'name']
        }
      ]
    })

    const orderedProduct = await OrderedProducts.findByPk(orderedProductId, {
      include: [
        {
          model: OrderStatus,
          attributes: ['id', 'name']
        }
      ]
    })

    if (!orderedProduct) {
      return responseHandler(res, 400, 'Ordered product not found')
    }

    const { name: status } = orderedProduct.orderStatus

    if (status !== 'Completed' && status !== 'Canceled') {
      return responseHandler(res, 400, 'Only canceled or completed order can be deleted')
    }

    const roleName = user.role.name

    if (roleName === 'user') {
      if (userId !== orderedProduct.userId) {
        return responseHandler(res, 400, 'You can only delete your ordered product')
      }
      orderedProduct.deletedAt = new Date()
      await orderedProduct.save()
      return responseHandler(res, 200, 'Ordered product deleted', orderedProduct)
    } else if (roleName === 'seller') {
      const storeId = user.storeId

      if (storeId !== orderedProduct.storeId) {
        return responseHandler(res, 400, 'You can only delete your ordered product')
      } else {
        await orderedProduct.destroy()
        return responseHandler(res, 200, 'Ordered product deleted', orderedProduct)
      }
    }

    // console.log(role.role.name)
    return responseHandler(res, 200, 'no access')
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else {
      return responseHandler(res, 500, 'Error while get ordered product')
    }
  }
}
