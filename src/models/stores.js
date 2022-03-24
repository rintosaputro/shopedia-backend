const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')
const Users = require('./users')

const Stores = sequelize.define('store', {
  name: {
    type: Sequelize.STRING,
    unique: {
      msg: 'Name already exists!'
    },
    validate: {
      notEmpty: {
        msg: 'Name store must be fill'
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  userId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'User Id must be fill'
      }
    },
    references: {
      model: Users,
      key: 'id'
    }
  }
})

module.exports = Stores
