const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')
// const Products = require('../routes/products')
// const Users = require('./users')

const ProductReview = sequelize.define('product_review', {
  userId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'User Id must be fill'
      }
    }
    // references: {
    //   model: Users,
    //   key: 'id'
    // }
  },
  productId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Product Id must be fill'
      }
    }
    // references: {
    //   model: Products,
    //   key: 'id'
    // }
  },
  comment: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: {
        msg: 'Comment must be fill'
      }
    }
  }
})

module.exports = ProductReview
