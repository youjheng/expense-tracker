const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record')
const User = require('../user')
const Category = require('../category')
const recordData = require('./recordData.json').results
const db = require('../../config/mongoose')

const SEED_USER = {
  name: 'Daddy',
  email: 'daddy@example.com',
  password: '12345678'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      return Promise.all(recordData.map(data => {
        return Category.findOne({ name: data.category })
          .lean()
          .then(category => {
            data.category = category._id
            data.userId = user._id
            return Record.create(data)
          })
      }))
    })
    .then(() => {
      console.log('recordSeeder is done')
      process.exit()
    })
})