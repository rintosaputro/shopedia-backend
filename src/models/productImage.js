const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')
// const Products = require('./products')

const ProductImage = sequelize.define('product_images', {
  productId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Product id must be fill'
      }
    }
    // references: {
    //   model: Products,
    //   key: 'id'
    // }
  },
  image: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Product image can not be empty'
      }
    }
  }
})

module.exports = ProductImage
