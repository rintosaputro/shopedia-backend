const auth = require('express').Router()

const {
  register,
  login
} = require('../controllers/users')

auth.post('/register', register)
auth.post('/login', login)

module.exports = auth
