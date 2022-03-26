const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Transactions = sequelize.define('transactions', {
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
      }
    }
  },
  address: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Address can not be empty'
      },
      notNull: {
        msg: 'Address can not be null'
      }
    }
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone can not be empty'
      },
      notNull: {
        msg: 'Phone can not be null'
      },
      len: {
        args: [10, 15],
        msg: 'Phone must be between 10 and 15 characters'
      }
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name can not be empty'
      },
      notNull: {
        msg: 'Name can not be null'
      }
    }
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'You must provide a user ID'
      },
      isInt: {
        msg: 'User ID must be an integer'
      },
      notNull: {
        msg: 'You must provide a user ID'
      }
    }
  },
  paymentMethodId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'You must provide a Payment Method ID'
      },
      isInt: {
        msg: 'Payment Method ID must be an integer'
      },
      notNull: {
        msg: 'You must provide a Payment Method ID'
      }
    }
  },
  shippingMethodId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'You must provide a Shipping Method ID'
      },
      isInt: {
        msg: 'Shipping Method ID must be an integer'
      },
      notNull: {
        msg: 'You must provide a Shipping Method ID'
      }
    }
  }
})

Transactions.belongsTo(require('./users'), {
  foreignKey: 'userId'
})
Transactions.belongsTo(require('./paymentMethods'), {
  foreignKey: 'paymentMethodId'
})
Transactions.belongsTo(require('./shippingMethods'), {
  foreignKey: 'shippingMethodId'
})
Transactions.hasMany(require('./orderedProduct'), {
  // as: 'orderedProducts',
  foreignKey: 'transactionId'
})

module.exports = Transactions
