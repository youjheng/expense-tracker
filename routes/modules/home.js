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
        .then(records => {
          records.forEach(record => record.date = record.date.toISOString().split('T')[0])
          records.forEach(record => record.category = record.category.icon)
          res.render('index', { records })
        })
        .catch(err => console.error(err))
    })
})

module.exports = router