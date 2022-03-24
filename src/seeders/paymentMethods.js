const PaymentMethods = require('../models/paymentMethods')

exports.paymentMethodSeed = async () => {
  try {
    const result = await PaymentMethods.findAll()

    if (result.length > 0) {
      return
    }

    await PaymentMethods.bulkCreate([
      {
        name: 'COD'
      },
      {
        name: 'Bank Transfer'
      },
      {
        name: 'Credit Card'
      },
      {
        name: 'Paypal'
      },
      {
        name: 'Gopay'
      },
      {
        name: 'Dana'
      },
      {
        name: 'OVO'
      }
    ])
  } catch (error) {
    console.error(error)
  }
}
