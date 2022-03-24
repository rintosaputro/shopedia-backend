const {
  listRoles,
  addRole
} = require('../controllers/roles')
const {
  verifyAdmin
} = require('../middlewares/auth')

const roles = require('express').Router()

roles.get('/', listRoles)
roles.post('/', verifyAdmin, addRole)

module.exports = roles
