const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')
const ProductImage = require('./productImage')
const ProductReview = require('./productReview')
const Brands = require('./brands')
const Categories = require('./categories')
const Stores = require('./stores')

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
  },
  condition: {
    type: Sequelize.ENUM(['New', 'Second']),
    validate: {
      notEmpty: {
        msg: 'Condition can not be empty'
      },
      isIn: {
        args: [['New', 'Second']],
        msg: 'Condition must be New or Second'
      }
    }
  },
  brandId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Brand id must be fill'
      }
    }
  },
  categoryId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Category Id must be fill'
      }
    }
  },
  storeId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: {
        msg: 'Please make your store first'
      }
    }
  }
})

Stores.hasMany(Products)
Products.hasMany(ProductImage)
Products.hasMany(ProductReview)
Products.belongsTo(Brands, {
  foreignKey: 'brandId'
})
Products.belongsTo(Categories, {
  foreignKey: 'categoryId'
})

module.exports = Products
