const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const OrderedProducts = sequelize.define('orderedProducts', {
  qty: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Qty can not be empty'
      },
      isInt: {
        msg: 'Qty must be an integer'
      },
      notNull: {
        msg: 'Qty can not be null'
      },
      min: {
        args: [1],
        msg: 'Qty must be greater than 0'
      }
    }
  },
  total: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Total can not be empty'
      },
      isInt: {
        msg: 'Total must be an integer'
      },
      notNull: {
        msg: 'Total can not be null'
      },
      min: {
        args: [1],
        msg: 'Total must be greater than 0'
      }
    }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'productId can not be empty'
      },
      isInt: {
        msg: 'productId must be an integer'
      },
      notNull: {
        msg: 'productId can not be null'
      }
    }
  },
  transactionId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'transactionId can not be empty'
      },
      isInt: {
        msg: 'transactionId must be an integer'
      },
      notNull: {
        msg: 'transactionId can not be null'
      }
    }
  },
  orderStatusId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'orderStatusId can not be empty'
      },
      isInt: {
        msg: 'orderStatusId must be an integer'
      },
      notNull: {
        msg: 'orderStatusId can not be null'
      }
    }
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'userId can not be empty'
      },
      isInt: {
        msg: 'userId must be an integer'
      },
      notNull: {
        msg: 'userId can not be null'
      }
    }
  },
  storeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'storeId can not be empty'
      },
      isInt: {
        msg: 'storeId must be an integer'
      },
      notNull: {
        msg: 'storeId can not be null'
      }
    }
  },
  deletedAt: {
    type: Sequelize.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'deletedAt must be a date'
      }
    }
  }
})

OrderedProducts.belongsTo(require('./products'), {
  foreignKey: 'productId'
})
// OrderedProducts.belongsTo(require('./transactions'), {
//   foreignKey: 'transactionId'
// })
OrderedProducts.belongsTo(require('./orderStatus'), {
  foreignKey: 'orderStatusId'
})
OrderedProducts.belongsTo(require('./users'), {
  foreignKey: 'userId'
})

OrderedProducts.belongsTo(require('./stores'), {
  foreignKey: 'storeId'
})

module.exports = OrderedProducts
