const auth = require('express').Router()

const {
  register,
  login,
  resetVerify
} = require('../controllers/auth')

auth.post('/register', register)
auth.post('/login', login)
auth.post('/reset-verify', resetVerify)

module.exports = auth
