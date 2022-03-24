const { responseHandler } = require('../helpers/responseHandler')
const ShippingMethods = require('../models/shippingMethods')

exports.listShippingMethods = async (req, res) => {
  try {
    const shippingMethods = await ShippingMethods.findAll({
      attributes: ['id', 'name', 'cost']
    })

    return responseHandler(res, 200, 'Shipping methods listed', shippingMethods)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error while listing shipping methods')
  }
}
