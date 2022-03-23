const {
  responseHandler
} = require('../helpers/responseHandler')
const Roles = require('../models/roles')

exports.listRoles = async (req, res) => {
  try {
    const result = await Roles.findAll()

    if (!result) {
      return responseHandler(res, 404, 'Roles not found')
    }

    return responseHandler(res, 200, 'List of roles', result)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, error)
  }
}

exports.addRole = async (req, res) => {
  try {
    const {
      name
    } = req.body

    const result = await Roles.create({
      name
    })

    return responseHandler(res, 200, 'Role added', result)
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Internal server error')
  }
}

exports.deleteRole = async (req, res) => {
  try {
    const {
      id
    } = req.params

    const role = await Roles.findByPK(id)

    const result = await Roles.destroy({
      where: {
        id
      }
    })

    if (!result) {
      return responseHandler(res, 404, 'Role not found')
    }

    if (role) {
      return responseHandler(res, 200, 'Role deleted', role)
    }
  } catch (error) {
    console.error(error)
    return responseHandler(res, 500, 'Internal server error')
  }
}
