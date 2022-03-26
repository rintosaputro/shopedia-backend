const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Brands = sequelize.define('brands', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Brand already used'
    },
    validate: {
      notEmpty: {
        msg: 'Brand name is required'
      }
    }
  }
})

module.exports = Brands
