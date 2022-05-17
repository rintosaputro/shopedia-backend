const Sequelize = require('sequelize')

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT,
  DB_ENABLE_SSL
} = process.env

let sequelize
let sslEnable

if (DB_ENABLE_SSL === 'true') {
  sslEnable = true
} else {
  sslEnable = false
}

console.log(DB_DIALECT)

if (DB_DIALECT === 'postgres') {
  sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
      host: DB_HOST,
      dialect: 'postgres',
      dialectOptions: sslEnable && {
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
