const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const OtpCodes = sequelize.define('otpCodes', {
  type: {
    type: Sequelize.ENUM(['verify', 'reset']),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Type is required'
      },
      isIn: {
        args: [
          ['verify', 'reset']
        ],
        msg: 'Type must be either verify or reset'
      }
    }
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Code is required'
      }
    }
  },
  expired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'User ID is required'
      }
    }
  }
})

module.exports = OtpCodes
