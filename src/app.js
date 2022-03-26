const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const sequelize = require('./helpers/sequelize')

const {
  PORT
} = process.env

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cors())
app.use(morgan('dev'))

app.use('/', require('./routes'))
app.use('/uploads', express.static('uploads'))

const httpMethods = ['get', 'post', 'put', 'patch', 'delete']

httpMethods.forEach((el) => {
  app[el]('*', (req, res) => {
    res.status(404)
    res.json({
      success: false,
      message: 'Destination not found'
    })
  })
})

app.listen(PORT, async () => {
  console.log(`App Listen PORT:${PORT}...`)
  await sequelize.sync()

  // add default static data using seeders
  require('./seeders').up()
})
