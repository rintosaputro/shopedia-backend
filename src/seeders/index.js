const { brandsSeed } = require('./brands')
const { categoriesSeed } = require('./categories')
const { orderStatusSeed } = require('./orderStatus')
const { paymentMethodSeed } = require('./paymentMethods')
const { rolesSeed } = require('./roles')
const { shippingMethodSeed } = require('./shippingMethods')

module.exports = {
  up: () => {
    rolesSeed()
    categoriesSeed()
    orderStatusSeed()
    brandsSeed()
    paymentMethodSeed()
    shippingMethodSeed()
  }
}
