const mongoose = require('mongoose')
const Category = require('../category')
const categoryData = require('./categoryData.json').results

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  categoryData.map(data => {
    Category.create(data)
  })
  console.log('done')
})