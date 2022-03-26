const { responseHandler } = require('../helpers/responseHandler')
const PaymentMethods = require('../models/paymentMethods')
const ShippingMethods = require('../models/shippingMethods')
const Transaction = require('../models/transactions')
const Users = require('../models/users')
const OrderedProducts = require('../models/orderedProduct')
const Products = require('../models/products')
const ProductImage = require('../models/productImage')

exports.listTransaction = async (req, res) => {
  try {
    const { id } = req.user

    const transactions = await Transaction.findAll({
      where: {
        userId: id
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })

    return responseHandler(res, 200, 'List Transaction', transactions)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const { id: userId } = req.user

    const { paymentMethodId, shippingMethodId, address, phone, name } = req.body

    const data = {
      paymentMethodId,
      shippingMethodId,
      userId,
      address,
      phone,
      name,
      total: 0
    }

    const transaction = await Transaction.create(data)

    const include = [
      {
        model: PaymentMethods,
        attributes: ['id', 'name']
      },
      {
        model: ShippingMethods,
        attributes: ['id', 'name']
      },
      {
        model: Users,
        attributes: ['id', 'name', 'email']
      }
    ]

    const result = await Transaction.findByPk(transaction.id, {
      attributes: ['id', 'total', 'phone', 'address', 'name'],
      include
    })

    return responseHandler(res, 201, 'Create Transaction', result)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else if (err.name === 'SequelizeForeignKeyConstraintError') {
      return responseHandler(res, 400, 'You must provide registered input data')
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.detailTransaction = async (req, res) => {
  try {
    const { id } = req.params

    const include = [
      {
        model: PaymentMethods,
        attributes: ['id', 'name']
      },
      {
        model: ShippingMethods,
        attributes: ['id', 'name']
      },
      {
        model: Users,
        attributes: ['id', 'name', 'email']
      },
      {
        model: OrderedProducts,
        attributes: ['id', 'qty', 'total'],
        include: [
          {
            model: Products,
            attributes: ['id', 'name', 'price'],
            include: [
              {
                model: ProductImage,
                attributes: ['id', 'image'],
                limit: 1
              }
            ]
          }
        ]
      }
    ]

    const result = await Transaction.findByPk(id, {
      attributes: ['id', 'total', 'phone', 'address', 'name'],
      include
    })

    return responseHandler(res, 200, 'Detail Transaction', result)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      return responseHandler(res, 400, 'Check your input', null, error)
    } else {
      return responseHandler(res, 500, 'Error while get detail transaction')
    }
  }
}
