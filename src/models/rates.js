const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Rates = sequelize.define('rates', {
  productId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'ProductId must be fill'
      }
    }
  },
  rate: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'rate must be fill'
      },
      isNumeric: {
        msg: 'rate must be a number'
      },
      min: 0,
      max: 5
    }
  }
})

module.exports = Rates
