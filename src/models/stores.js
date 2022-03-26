const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

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
  }
})

module.exports = Stores
