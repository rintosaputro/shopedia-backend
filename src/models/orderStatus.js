const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const OrderStatus = sequelize.define('orderStatuses', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Order Status already used'
    },
    validate: {
      notEmpty: {
        msg: 'Order Status can not be empty'
      }
    }
  }
})

module.exports = OrderStatus
