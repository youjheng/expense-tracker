const Record = require('../record')
const recordData = require('./recordData.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  recordData.map(seed => {
    Record.create(seed)
  })
  console.log('done')
})