const Sequelize = require('sequelize')
const { responseHandler } = require('../helpers/responseHandler')
const Products = require('../models/products')
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
    const id = user.storeId
    const store = await Stores.findByPk(id, {
      include: {
        model: Products,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'storeId']
        }
      },
      attributes: ['id', 'name', 'description']
    })
    if (!store) {
      return responseHandler(res, 404, 'Data not found')
    }
    return responseHandler(res, 200, 'List Store with user', store)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}
