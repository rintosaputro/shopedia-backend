const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')

const Categories = sequelize.define('categories', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      msg: 'Category already used'
    },
    validate: {
      notEmpty: {
        msg: 'Category can not be empty'
      }
    }
  }
})

module.exports = Categories
