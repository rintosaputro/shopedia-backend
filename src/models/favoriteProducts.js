const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const FavoriteProducts = sequelize.define('favoriteProducts', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // references: {
    //   model: require('./users'),
    //   key: 'id'
    // },
    validate: {
      notNull: {
        msg: 'User ID cannot be null'
      },
      notEmpty: {
        msg: 'User ID cannot be empty'
      }
    }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // references: {
    //   model: require('./products'),
    //   key: 'id'
    // },
    validate: {
      notNull: {
        msg: 'Product ID cannot be null'
      },
      notEmpty: {
        msg: 'Product ID cannot be empty'
      }
    }
  }
})

FavoriteProducts.belongsTo(require('./users'), {
  foreignKey: 'userId'
})
FavoriteProducts.belongsTo(require('./products'), {
  foreignKey: 'productId'
})
FavoriteProducts.belongsTo(require('./productImage'), {
  foreignKey: 'productId'
})

module.exports = FavoriteProducts
