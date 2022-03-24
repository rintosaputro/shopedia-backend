const ShippingMethods = require('../models/shippingMethods')

exports.shippingMethodSeed = async () => {
  try {
    const result = await ShippingMethods.findAll()

    if (result.length > 0) {
      return
    }

    await ShippingMethods.bulkCreate([
      {
        name: 'Standard',
        cost: 5000
      },
      {
        name: 'Express',
        cost: 10000
      },
      {
        name: 'Free',
        cost: 0
      }
    ])
  } catch (error) {
    console.error(error)
  }
}
