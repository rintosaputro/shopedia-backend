const Sequelize = require('sequelize')
const { dinamisUrl } = require('../helpers/dinamisUrl')
const { pageInfo } = require('../helpers/pageInfo')
const { responseHandler } = require('../helpers/responseHandler')
const ProductImage = require('../models/productImage')
const Products = require('../models/products')
const Rates = require('../models/rates')
const Stores = require('../models/stores')
const Users = require('../models/users')

exports.getStore = async (req, res) => {
  try {
    const { search = '' } = req.query
    const store = await Stores.findAll({
      attributes: ['id', 'name'],
      where: {
        name: {
          [Sequelize.Op.like]: `%${search}%`
        }
      }
    })
    if (store.length === 0) {
      return responseHandler(res, 404, 'Data not found')
    }
    return responseHandler(res, 200, 'List store', store)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.createStore = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['id', 'storeId']
    })
    if (!user) {
      return responseHandler(res, 404, 'User Id not found')
    }
    if (user.storeId) {
      return responseHandler(res, 400, 'One account just for one store')
    }
    const store = await Stores.create(req.body)
    user.storeId = store.id
    await user.save()
    return responseHandler(res, 200, 'Store Created!', store)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.updateStore = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['id', 'storeId']
    })
    const store = await Stores.findByPk(user.storeId)
    if (!store) {
      return responseHandler(res, 404, 'Data not found')
    }
    for (const key in req.body) {
      store[key] = req.body[key]
    }
    await store.save()
    return responseHandler(res, 200, 'Store Updated', store)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.deleteStore = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['id', 'storeId']
    })
    const store = await Stores.findByPk(user.storeId)
    if (!store) {
      return responseHandler(res, 404, 'Data not found')
    }
    await store.destroy()
    user.storeId = null
    await user.save()
    return responseHandler(res, 200, 'Store Deleted!', store)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.getStoreWithUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ['id', 'storeId']
    })
    const { search = '', sort = 'ASC', orderBy = 'id', minPrice = 0, maxPrice = 1000000000, brandId = '', categoryId = '', condition = '' } = req.query
    let { page, limit } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 3
    const offset = (page - 1) * limit
    const { count, rows } = await Products.findAndCountAll({
      where: {
        storeId: user.storeId,
        name: {
          [Sequelize.Op.like]: `%${search}%`
        },
        price: {
          [Sequelize.Op.gt]: minPrice,
          [Sequelize.Op.lt]: maxPrice
        },
        brandId: {
          [Sequelize.Op.like]: `${brandId}%`
        },
        categoryId: {
          [Sequelize.Op.like]: `${categoryId}%`
        },
        condition: {
          [Sequelize.Op.like]: `${condition}%`
        }
      },
      model: Products,
      attributes: ['id', 'name', 'stock', 'price', 'createdAt'],
      include: [
        {
          model: ProductImage,
          attributes: ['image'],
          limit: 1
        },
        {
          model: Rates,
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('rate')), 'rate']
          ]
        }
      ],
      order: [
        [orderBy, sort]
      ],
      limit: limit,
      offset: offset

    })
    const url = dinamisUrl(req.query)
    const pInfo = pageInfo(count, limit, page, url, 'stores/my-store')
    const product = rows
    if (product.length === 0) {
      return responseHandler(res, 404, 'Data not found')
    }
    return responseHandler(res, 200, 'List Product', product, null, pInfo)
  } catch (err) {
    console.error(err)
    if (!err.errors) {
      return responseHandler(res, 500, 'Unexpected error')
    }
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}
