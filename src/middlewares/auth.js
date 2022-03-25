const jwt = require('jsonwebtoken')
const {
  responseHandler
} = require('../helpers/responseHandler')
const Roles = require('../models/roles')
const Users = require('../models/users')

const {
  SECRET_KEY
} = process.env

const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return responseHandler(res, 401, 'Unauthorized')
    }

    const token = authHeader.split(' ')[1]
    const decode = jwt.verify(token, SECRET_KEY)

    if (!decode) {
      return responseHandler(res, 401, 'Unauthorized')
    }

    const {
      id
    } = decode

    const user = await Users.findByPk(id)

    if (!user) {
      return responseHandler(res, 404, 'User not found')
    }

    const {
      roleId
    } = user.dataValues

    const role = await Roles.findByPk(roleId)

    if (!role) {
      return responseHandler(res, 404, 'Role not found')
    }

    const {
      name
    } = role.dataValues

    decode.role = name

    return decode
  } catch (error) {
    console.log(error)
    return responseHandler(res, 500, 'Error occured while verifying user')
  }
}

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await verifyToken(req, res)

    if (user.id) {
      req.user = {
        id: user.id
      }
      next()
    }
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error occured while verifying user')
  }
}

exports.verifyAdmin = async (req, res, next) => {
  try {
    const user = await verifyToken(req, res)

    if (user) {
      const {
        role
      } = user

      if (role.includes('admin')) {
        next()
      } else {
        return responseHandler(res, 403, 'Forbidden')
      }
    }
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error occured while verifying user')
  }
}

exports.verifySeller = async (req, res, next) => {
  try {
    const user = await verifyToken(req, res)

    if (user) {
      const {
        role
      } = user

      if (role.includes('seller')) {
        req.user = {
          id: user.id
        }
        next()
      } else {
        return responseHandler(res, 403, 'Forbidden')
      }
    }
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error occured while verifying user')
  }
}

exports.verifyUserConfirmed = async (req, res, next) => {
  try {
    const user = await verifyToken(req, res)

    if (user.id) {
      const { confirmed } = await Users.findByPk(user.id)
      if (confirmed) {
        req.user = {
          id: user.id
        }
        next()
      } else {
        return responseHandler(res, 403, 'User not confirmed')
      }
    } else {
      return responseHandler(res, 403, 'Forbidden')
    }
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error occured while verifying user')
  }
}
