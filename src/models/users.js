const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Users = sequelize.define('users', {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  },
  gender: {
    type: Sequelize.ENUM(['male', 'female']),
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  image: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already taken'
    },
    validate: {
      isEmail: {
        msg: 'Email must be a valid email'
      },
      notEmpty: {
        msg: 'Email can not be empty'
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password can not be empty'
      }
    }
  }
})

module.exports = Users
