const {
  responseHandler
} = require('../helpers/responseHandler')

exports.inputValidate = (req, res, next) => {
  try {
    console.log('validator', req.body)

    next()
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Unexpected Error while validating user')
  }
}
