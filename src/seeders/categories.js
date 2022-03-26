const Categories = require('../models/categories')

exports.categoriesSeed = async () => {
  const categories = await Categories.findAll()
  if (categories.length > 0) {
    return
  }

  // furnitures category list
  await Categories.bulkCreate([
    {
      name: 'Beds'
    },
    {
      name: 'Chairs'
    },
    {
      name: 'Tables'
    },
    {
      name: 'Cabinets'
    },
    {
      name: 'Sofas'
    },
    {
      name: 'Wardrobes'
    },
    {
      name: 'Storage'
    },
    {
      name: 'Desks'
    },
    {
      name: 'Lamps'
    },
    {
      name: 'Clocks'
    }
  ])
}
