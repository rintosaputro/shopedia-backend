const express = require('express')
const app = express()

const cors = require('cors')
const morgan = require('morgan')

const {
  PORT
  // ENVIRONMENT
} = process.env

app.use(express.urlencoded({
  extended: true
}))
app.use(cors())
app.use(morgan('dev'))

app.use(express.static('uploads'))
app.use(require('./routes'))

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Shopedia API'
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
