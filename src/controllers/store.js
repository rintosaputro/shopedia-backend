const { responseHandler } = require('../helpers/responseHandler')
const Stores = require('../models/stores')
const Users = require('../models/users')

exports.getStore = async (req, res) => {
  try {
    const store = await Stores.findAll()
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
    const userId = await Users.findByPk(req.body.userId)
    if (!userId) {
      return responseHandler(res, 404, 'User Id not found')
    }
    const store = await Stores.create(req.body)
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
    const store = await Stores.findByPk(req.params.id)
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
    const store = await Stores.findByPk(req.params.id)
    if (!store) {
      return responseHandler(res, 404, 'Data not found')
    }
    await store.destroy()
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
    const store = await Users.findAll({
      include: Stores
    })
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
