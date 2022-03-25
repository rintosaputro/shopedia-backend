const { responseHandler } = require('../helpers/responseHandler')
const Brands = require('../models/brands')

exports.listBrands = async (req, res) => {
  try {
    const result = await Brands.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    responseHandler(res, 200, 'Brand List', result)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error while listing brands')
  }
}

exports.addBrand = async (req, res) => {
  try {
    const { name } = req.body

    const result = await Brands.create({
      name
    })

    return responseHandler(res, 201, 'Brand Created', result)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Error while adding brand')
  }
}
