const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Stores = sequelize.define('store', {
  name: {
    type: Sequelize.STRING,
    unique: {
      msg: 'Name already exists!'
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name store must be fill'
      },
      notNull: {
        msg: 'Name store must be fill'
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Description store must be fill'
      },
      notNull: {
        msg: 'Description store must be fill'
      }
    }
  }
})

module.exports = Stores
