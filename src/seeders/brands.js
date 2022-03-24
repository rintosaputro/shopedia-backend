const Brands = require('../models/brands')

exports.brandsSeed = async () => {
  try {
    const brands = await Brands.findAll()

    if (brands.length > 0) {
      return
    }

    // furnitures brand list
    await Brands.bulkCreate([
      {
        name: 'IKEA'
      },
      {
        name: 'Mr Royal'
      },
      {
        name: 'Sweet House'
      },
      {
        name: 'North Oxford'
      },
      {
        name: 'Mr.Poppin 1929'
      },
      {
        name: 'Olympic'
      },
      {
        name: 'Informa'
      }
    ])
  } catch (error) {
    console.error(error)
  }
}
