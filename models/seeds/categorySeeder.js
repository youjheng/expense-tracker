if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const categoryData = require('./categoryData.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  Promise.all(categoryData.map(data => {
    return Category.create(data)
  }))
    .then(() => {
      console.log('categorySeeder is done')
      process.exit()
    })
})