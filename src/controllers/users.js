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
      const filename = cloudPathToFileName(user.image)
      deleteFile(filename)
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
      attributes: ['id', 'name', 'email', 'gender', 'username', 'confirmed', 'description', 'image', 'roleId', 'storeId'],
      include: [{
        model: Roles
      }]
    })

    if (!user) {
      return responseHandler(res, 404, 'User not found')
    }

    return responseHandler(res, 200, 'User found', user)
  } catch (error) {
    return responseHandler(res, 500, 'Unexpected Error while getting profile')
  }
}
