const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const Record = require('./models/record')
const Category = require('./models/category')

const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({  defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      records.forEach(record => record.date = record.date.toISOString().split('T')[0])
      res.render('index', { records })
    })
    .catch(err => console.error(err))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const record = req.body
  Category.findOne({ name: record.category })
    .then(category => {
      record.category = category._id
      Record.create(record)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

app.get('/records/:id/edit', (req, res) => {
  const _id = req.params.id
  return Record.findOne({ _id })
    .lean()
    .then((record) => {
      record.date = record.date.toISOString().split('T')[0]
      Category.findOne({ _id: record.category})
        .lean()
        .then(categories => res.render('edit', { record, category: categories.name }))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

app.put('/records/:id', (req, res) => {
  const _id = req.params.id
  const record = req.body
  Category.findOne({ name: record.category})
    .then(category => {
      record.category = category._id
      return Record.findOneAndUpdate({ _id }, {
        name: record.name,
        date: record.date,
        amount: record.amount,
        category: record.category
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

app.delete('/records/:id', (req, res) => {
  const _id = req.params.id
  return Record.findOne({ _id })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})