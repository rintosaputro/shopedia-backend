const { responseHandler } = require('../helpers/responseHandler')
const PaymentMethods = require('../models/paymentMethods')

exports.paymentMethodList = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethods.findAll({
      attributes: ['id', 'name']
    })

    responseHandler(res, 200, 'List of payment methods', paymentMethods)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error on get payment methods')
  }
}

exports.addPaymentMethod = async (req, res) => {
  try {
    const { name } = req.body

    const paymentMethod = await PaymentMethods.create({
      name
    })

    responseHandler(res, 201, 'Payment method created', paymentMethod)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error occured while adding payment method')
  }
}

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params

    const paymentMethod = await PaymentMethods.findOne({
      where: {
        id
      }
    })

    if (!paymentMethod) {
      return responseHandler(res, 404, 'Payment method not found')
    }

    await paymentMethod.destroy()

    responseHandler(res, 200, 'Payment method deleted', paymentMethod.dataValues)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error occured while deleting payment method')
  }
}
