const OrderStatus = require('../models/orderStatus')

exports.orderStatusSeed = async () => {
  try {
    const orderStatus = await OrderStatus.findAll()

    const orderStatusData = [
      {
        name: 'Paid'
      },
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
    ]

    if (orderStatus.length >= orderStatusData.length) {
      return
    }

    await OrderStatus.bulkCreate(orderStatusData)
  } catch (err) {
    console.error(err)
  }
}
