const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Roles = sequelize.define('roles', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Role already used'
    },
    validate: {
      notEmpty: {
        msg: 'Role name is required'
      }
    }
  }
})

module.exports = Roles
