const OrderStatus = require('../models/orderStatus')

exports.orderStatusSeed = async () => {
  try {
    const orderStatus = await OrderStatus.findAll()
    if (orderStatus.length > 0) {
      return
    }

    await OrderStatus.bulkCreate([
      {
        name: 'Processed'
      },
      {
        name: 'Sent'
      },
      {
        name: 'Completed'
      },
      {
        name: 'Cancelled'
      }
    ])
  } catch (err) {
    console.error(err)
  }
}
