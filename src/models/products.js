const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Products = sequelize.define('products', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Name can not be empty'
      }
    }
  },
  stock: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Stock must be fill'
      },
      isNumeric: {
        msg: 'Stock must be a number'
      },
      min: 0
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  price: {
    type: Sequelize.DECIMAL,
    validate: {
      isDecimal: {
        msg: 'Price must be a number or decimal value'
      },
      min: 0
    }
  }
})
module.exports = Products
