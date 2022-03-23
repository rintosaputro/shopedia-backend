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
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
    unique: {
      msg: 'Username already used'
    }
  },
  confirmed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  roleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'You must select a role'
      },
      notNull: {
        msg: 'You must select a role'
      }
    }
  }
})

module.exports = Users
