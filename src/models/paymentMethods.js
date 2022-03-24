const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const PaymentMethods = sequelize.define('payment_methods', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Payment method already used'
    },
    validate: {
      notEmpty: {
        msg: 'Payment method name is required'
      }
    }
  }
})

module.exports = PaymentMethods
