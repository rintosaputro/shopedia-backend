const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const ShippingMethods = sequelize.define('shippingMethods', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Shipping method already added'
    },
    validate: {
      notEmpty: {
        msg: 'Name can not be empty'
      }
    }
  },
  cost: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Cost can not be empty'
      },
      isInt: {
        msg: 'Cost must be an integer'
      },
      min: 3000
    }
  }
})

module.exports = ShippingMethods
