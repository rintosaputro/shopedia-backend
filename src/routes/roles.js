const {
  listRoles,
  addRole
} = require('../controllers/roles')
const {
  verifyUser
} = require('../middlewares/auth')

const roles = require('express').Router()

roles.get('/', verifyUser, listRoles)
roles.post('/', addRole)

module.exports = roles
