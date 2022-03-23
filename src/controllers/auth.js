const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const {
  responseHandler
} = require('../helpers/responseHandler')

const Users = require('../models/users')
const OtpCodes = require('../models/otpCodes')
const Roles = require('../models/roles')

const {
  sendMail
} = require('../helpers/mail')

const {
  SECRET_KEY
} = process.env

exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      roleId
    } = req.body

    if (!email || !password) {
      return responseHandler(res, 400, 'Email and password are required')
    }

    const role = await Roles.findByPk(roleId)

    if (!role) {
      return responseHandler(res, 400, 'Role not found')
    }

    const roleName = role.dataValues.name

    if (roleName.includes('admin')) {
      return responseHandler(res, 400, 'You are not allowed to register as admin')
    }

    const passwordRules = {
      minLength: 8,
      maxLength: 16,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1
    }

    const passwordValidation = validator.isStrongPassword(password, passwordRules)

    if (!passwordValidation) {
      return responseHandler(res, 400, 'Password must be at least 8 characters, maximum 16 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await Users.create({
      email,
      password: hashedPassword,
      roleId
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
      return responseHandler(res, 400, 'Failed to login', null, err.errors.map(error => ({
        field: error.path,
        message: error.message
      })))
    } else {
      return responseHandler(res, 500, 'Unexpeted Error')
    }
  }
}

const sendCode = async (type, userId, callbackUrl, email) => {
  try {
    const otpCode = await OtpCodes.findOne({
      where: {
        userId
      }
    })

    if (otpCode) {
      const {
        createdAt
      } = otpCode.dataValues

      const now = new Date()
      const diff = now - createdAt

      const limit = 6 * 1000

      if (diff < limit) {
        return 'Code already sent wait for 1 minute'
      }

      const result = await OtpCodes.destroy({
        where: {
          userId,
          type,
          expired: false
        }
      })

      console.log(result)
    }

    // generate code
    const code = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const result = await OtpCodes.create({
      type,
      userId,
      code
    })

    if (!result) {
      return 'Failed to send code'
    }

    const {
      id
    } = result.dataValues

    console.log('new token id', id)

    const token = jwt.sign({
      id
    }, SECRET_KEY)

    const url = `${callbackUrl}?token=${token}`

    console.log('url', url)

    const sended = await sendMail({
      to: email,
      link: url,
      reset: type === 'reset'
    })

    if (!sended) {
      return 'Failed to send email'
    }

    console.log('sended', sended)

    return false
  } catch (error) {
    console.error(error)
    return 'Error occured while sending code'
  }
}

exports.resetVerify = async (req, res) => {
  try {
    const {
      email,
      token,
      password,
      confirmPassword
    } = req.body

    const {
      callbackUrl
    } = req.query

    if (!email && !token && !password && !confirmPassword && !callbackUrl) {
      return responseHandler(res, 400, 'You entered nothing')
    }

    if (callbackUrl || email) {
      if (!email) {
        return responseHandler(res, 400, 'Email is required to send code')
      }

      if (!callbackUrl) {
        return responseHandler(res, 400, 'Callback url is required to send code')
      }

      const user = await Users.findOne({
        where: {
          email
        }
      })

      if (user === null) {
        return responseHandler(res, 400, 'You are not registered')
      }

      const {
        confirmed,
        id
      } = user.dataValues

      let error = null
      if (confirmed) {
        error = await sendCode('reset', id, callbackUrl, email)
      } else {
        error = await sendCode('verify', id, callbackUrl, email)
      }

      if (error) {
        return responseHandler(res, 500, error)
      } else {
        return responseHandler(res, 200, 'Code sent')
      }
    }

    if (token) {
      const result = jwt.verify(token, SECRET_KEY)

      if (!result) {
        return responseHandler(res, 400, 'Invalid token')
      }

      const {
        id: otpId
      } = result

      const otpCode = await OtpCodes.findOne({
        where: {
          id: otpId
        }
      })

      if (!otpCode) {
        return responseHandler(res, 400, 'Invalid token')
      }

      const {
        expired
      } = otpCode.dataValues

      if (expired) {
        await OtpCodes.destroy({
          where: {
            id: otpId
          }
        })
        return responseHandler(res, 400, 'Token expired, please request new code')
      }

      const {
        type,
        userId
      } = otpCode.dataValues

      if (type !== 'reset') {
        const user = await Users.findByPk(userId)

        if (!user) {
          return responseHandler(res, 400, 'Invalid token')
        }

        // update confirmed
        const result = Users.update({
          confirmed: true
        }, {
          where: {
            id: userId
          }
        })

        if (!result) {
          return responseHandler(res, 500, 'Failed to verify user')
        }
        await OtpCodes.update({
          expired: true
        }, {
          where: {
            id: otpId
          }
        })
        return responseHandler(res, 200, 'User verified')
      } else {
        if (!password || !confirmPassword) {
          return responseHandler(res, 400, 'Password and confirm password are required')
        }

        if (password !== confirmPassword) {
          return responseHandler(res, 400, 'Password and confirm password does not match')
        }

        const passwordRules = {
          minLength: 8,
          maxLength: 16,
          minLowerCase: 1,
          minUpperCase: 1,
          minNumbers: 1,
          minSymbols: 1
        }

        const passwordValid = validator.isStrongPassword(password, passwordRules)

        if (!passwordValid) {
          return responseHandler(res, 400, 'Password must be at least 8 characters, maximum 16 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const result = await Users.update({
          password: hashedPassword
        }, {
          where: {
            id: userId
          }
        })

        if (!result) {
          return responseHandler(res, 500, 'Failed to reset password')
        } else {
          await OtpCodes.update({
            expired: true
          }, {
            where: {
              id: otpId
            }
          })
          return responseHandler(res, 200, 'Password reset')
        }
      }
    }

    return responseHandler(res, 200, 'Nothing can implemented yet')
  } catch (err) {
    console.error(err)
    if (err.errors) {
      return responseHandler(res, 400, 'Unexpeted Errors', null, err.errors.map(error => ({
        field: error.path,
        message: error.message
      })))
    } else {
      return responseHandler(res, 500, 'Unexpeted Error')
    }
  }
}
