const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const record = req.body
  Category.findOne({ name: record.category })
    .then(category => {
      record.category = category._id
      return Record.create({
        name: record.name,
        date: record.date,
        amount: record.amount,
        category: record.category,
        userId
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      record.date = record.date.toISOString().split('T')[0]
      Category.findOne({ _id: record.category })
        .lean()
        .then(categories => res.render('edit', { record, category: categories.name }))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const record = req.body
  Category.findOne({ name: record.category })
    .then(category => {
      record.category = category._id
      return Record.findOneAndUpdate({ _id, userId }, {
        name: record.name,
        date: record.date,
        amount: record.amount,
        category: record.category
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router