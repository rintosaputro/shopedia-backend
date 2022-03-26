const { responseHandler } = require('../helpers/responseHandler')
const OrderStatus = require('../models/orderStatus')

exports.orderStatusList = async (req, res) => {
  try {
    const result = await OrderStatus.findAll()

    return responseHandler(res, 200, 'Order Status List', result)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Internal Server Error', error)
  }
}

exports.addOrderStatus = async (req, res) => {
  try {
    const { name } = req.body

    const result = await OrderStatus.create({
      name
    })

    return responseHandler(res, 201, 'Order Status Created', result)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Internal Server Error', error)
  }
}
