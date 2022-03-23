const user = require('express').Router()

const {
  getProfile,
  updateProfile
} = require('../controllers/users')
const uploadImage = require('../helpers/upload')
const {
  verifyUser
} = require('../middlewares/auth')

user.get('/profile', verifyUser, getProfile)

user.patch('/profile', verifyUser, uploadImage('image'), updateProfile)

module.exports = user
