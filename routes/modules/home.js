const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  Category.find()
    .lean()
    .then(() => {
      Record.find({ userId })
        .populate('category', 'icon')
        .lean()
        .sort({ date: 'asc' })
        .then(records => {
          let totalAmount = 0
          records.map(record => {
            record.date = record.date.toISOString().split('T')[0]
            record.category = record.category.icon
            totalAmount += record.amount
          })
          res.render('index', { records, totalAmount })
        })
        .catch(err => console.error(err))
    })
})

router.get('/filter', (req, res) => {
  const userId = req.user._id
  const categorySelect = req.query.category || ''

  Record.find({ userId })
    .populate('category')
    .lean()
    .sort({ date: 'asc' })
    .then(Record => {
      Record.map(record => {
        record.category = record.category.name
        record.date = record.date.toISOString().split('T')[0]
        return Record
      })
      const records = Record.filter(record => record.category.includes(categorySelect))
      Category.findOne({ name: categorySelect })
        .lean()
        .then(categories => {
          let totalAmount = 0
          records.map(record => {
            record.category = categories.icon
            totalAmount += record.amount
          })
          res.render('index', { records, totalAmount })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router