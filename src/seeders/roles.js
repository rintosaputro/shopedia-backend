const Roles = require('../models/roles')

exports.rolesSeed = async () => {
  const roles = await Roles.findAll()

  if (roles.length > 0) {
    return
  }

  await Roles.bulkCreate([
    {
      name: 'admin'
    },
    {
      name: 'user'
    },
    {
      name: 'seller'
    }
  ])
}
