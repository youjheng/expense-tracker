const Category = require('../category')
const categoryData = require('./categoryData.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  categoryData.map(data => {
    Category.create(data)
  })
  console.log('done')
})