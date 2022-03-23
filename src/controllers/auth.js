const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const {
  responseHandler
} = require('../helpers/responseHandler')
const Users = require('../models/users')

const {
  SECRET_KEY
} = process.env

exports.register = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return responseHandler(res, 400, 'Email and password are required')
    }

    const passwordRules = {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1
    }

    const passwordValidation = validator.isStrongPassword(password, passwordRules)

    if (!passwordValidation) {
      return responseHandler(res, 400, 'Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await Users.create({
      email,
      password: hashedPassword
    })

    console.log(user)

    responseHandler(res, 200, 'User registered')
  } catch (err) {
    console.error(err)

    if (err.errors) {
      return responseHandler(res, 400, 'Failed to register', null, err.errors.map(error => ({
        field: error.path,
        message: error.message
      })))
    } else {
      return responseHandler(res, 500, 'Unexpeted Error')
    }
  }
}

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return responseHandler(res, 400, 'Email and password are required')
    }

    const user = await Users.findOne({
      where: {
        email
      }
    })

    if (!user) {
      return responseHandler(res, 400, 'User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return responseHandler(res, 400, 'Invalid password')
    }

    const {
      id
    } = user.dataValues

    const token = jwt.sign({
      id
    }, SECRET_KEY)

    return responseHandler(res, 200, 'You are logged in', {
      token
    })
  } catch (err) {
    console.error(err)

    if (err.errors) {
      return responseHandler(res, 400, 'Failed to register', null, err.errors.map(error => ({
        field: error.path,
        message: error.message
      })))
    } else {
      return responseHandler(res, 500, 'Unexpeted Error')
    }
  }
}
