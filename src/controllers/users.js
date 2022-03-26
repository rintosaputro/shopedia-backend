const bcrypt = require('bcrypt')
const {
  cloudPathToFileName
} = require('../helpers/converter')
const {
  deleteFile
} = require('../helpers/fileHandler')
const {
  responseHandler
} = require('../helpers/responseHandler')
const Roles = require('../models/roles')
const Users = require('../models/users')
const Stores = require('../models/stores')

exports.updateProfile = async (req, res) => {
  try {
    const {
      id
    } = req.user

    const {
      name,
      gender,
      description,
      email,
      username
    } = req.body

    const user = await Users.findByPk(id, {
      attributes: ['id', 'name', 'email', 'username', 'confirmed', 'description', 'image', 'roleId', 'storeId'],
      include: [{
        model: Roles
      }]
    })

    if (!user) {
      if (req.file) {
        deleteFile(req.file.filename)
      }
      return responseHandler(res, 404, 'User not found')
    }

    let path = null

    if (req.file) {
      path = req.file.path
      if (user.image) {
        const filename = cloudPathToFileName(user.image)
        deleteFile(filename)
      }
    }

    const data = {
      name,
      gender,
      description,
      email,
      username,
      image: path
    }

    for (const key in data) {
      if (data[key]) {
        user[key] = data[key]
      }
    }

    if (data.email && user.confirmed) {
      user.confirmed = false
    }

    console.log(data)

    const result = await user.save()

    return responseHandler(res, 200, 'Profile updated successfully', result.dataValues)
  } catch (err) {
    console.error(err)

    if (req.file) {
      deleteFile(req.file.filename)
    }

    if (err.errors) {
      return responseHandler(res, 400, 'Failed to update profile', null, err.errors.map(error => ({
        field: error.path,
        message: error.message
      })))
    } else {
      return responseHandler(res, 500, 'Unexpected Error while updating profile')
    }
  }
}

exports.getProfile = async (req, res) => {
  try {
    const {
      id
    } = req.user

    const user = await Users.findByPk(id, {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'roleId', 'storeId']
      },
      include: [
        {
          model: Roles,
          attributes: ['id', 'name']
        },
        {
          model: Stores,
          attributes: ['id', 'name', 'description']
        }
      ]
    })

    if (!user) {
      return responseHandler(res, 404, 'User not found')
    }

    return responseHandler(res, 200, 'User found', user)
  } catch (error) {
    return responseHandler(res, 500, 'Unexpected Error while getting profile')
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user

    const user = await Users.findByPk(id)

    if (!user) {
      return responseHandler(res, 404, 'User not found')
    }

    const { oldPassword, newPassword, confirmPassword } = req.body

    const data = {
      oldPassword,
      newPassword,
      confirmPassword
    }

    for (const key in data) {
      if (!data[key]) {
        return responseHandler(res, 400, 'Please fill all the fields')
      }
    }

    if (newPassword !== confirmPassword) {
      return responseHandler(res, 400, 'New password and confirm password does not match')
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)

    if (!isMatch) {
      return responseHandler(res, 400, 'Old password is incorrect')
    }

    if (oldPassword === newPassword) {
      return responseHandler(res, 400, 'Old password and new password must be different')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    return responseHandler(res, 200, 'Password changed successfully')
  } catch (err) {
    console.error(err)

    return responseHandler(res, 500, 'Unexpected Error while changing password')
  }
}
