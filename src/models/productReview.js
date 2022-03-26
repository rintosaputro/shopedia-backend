const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')
const Users = require('./users')

const ProductReview = sequelize.define('product_review', {
  userId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'User Id must be fill'
      }
    }
  },
  productId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Product Id must be fill'
      }
    }
  },
  comment: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: {
        msg: 'Comment must be fill'
      }
    }
  },
  parentId: {
    type: Sequelize.INTEGER
  }
})

ProductReview.belongsTo(Users, {
  foreignKey: 'userId'
})
ProductReview.hasMany(ProductReview, {
  as: 'replies',
  foreignKey: 'parentId'
})

module.exports = ProductReview
