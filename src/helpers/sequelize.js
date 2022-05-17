const Sequelize = require('sequelize')

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT
} = process.env

let sequelize

console.log(DB_DIALECT)

if (DB_DIALECT === 'postgres') {
  sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
      host: DB_HOST,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  )
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT || 'mysql'
  })
}

module.exports = sequelize
