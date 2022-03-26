const { responseHandler } = require('../helpers/responseHandler')
const Sequelize = require('sequelize')
const Products = require('../models/products')
const Rates = require('../models/rates')

exports.rateProduct = async (req, res) => {
  try {
    const product = await Products.findByPk(req.body.productId)
    if (!product) {
      return responseHandler(res, 404, 'data not found')
    }
    const rate = await Rates.create(req.body)
    return responseHandler(res, 200, 'Rating Added', rate)
  } catch (err) {
    console.log(err)
    return responseHandler(res, 500, 'Unexpected error')
  }
}

exports.getRateByProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Products.findByPk(id)
    if (!product) {
      return responseHandler(res, 404, 'Data not found')
    }
    const rate = await Rates.findAll({
      where: {
        productId: id
      },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rate')), 'rate']
      ]
    })
    if (!rate) {
      return responseHandler(res, 404, 'Data not found')
    }
    return responseHandler(res, 200, 'Rate product', rate)
  } catch (err) {
    console.log(err)
    return responseHandler(res, 500, 'Unexpected error')
  }
}
