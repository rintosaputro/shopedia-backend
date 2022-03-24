const { brandsSeed } = require('./brands')
const { categoriesSeed } = require('./categories')
const { orderStatusSeed } = require('./orderStatus')
const { rolesSeed } = require('./roles')

module.exports = {
  up: () => {
    rolesSeed()
    categoriesSeed()
    orderStatusSeed()
    brandsSeed()
  }
}
