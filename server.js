const express = require('express')
const morgan = require('morgan')
const twilio = require('./drivers/twilio')
const mongo = require('./drivers/mongo')
const utilities = require('./util')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { DB_COL_USERS } = process.env

const app = express()

//logger middleware
app.use(morgan('dev'))

//parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//test API
app.get('/', (req, res) => res.send({ home: 'Bills API is live!' }))

// registration middleware
app.use(function(request, response, next) {
  const { From: from, Body: body } = request.body
  if (utilities.isRegisterText(body)) {
    request.isRegisterText = true
    const password = utilities.processRegisterText(body)
    bcrypt
      .hash(password, 10)
      .then(hash => [{ user: from, password: hash }])
      .then(user => mongo.write(user, DB_COL_USERS))
      .then(() => next())
  } else {
    return next()
  }
})

//logging/paying a bill. Only gets called by Twilio
app.post('/sms', function(request, response) {
  const {
    isRegisterText,
    body: { To: to, From: from, Body: body }
  } = request

  if (!isRegisterText) {
    const commands = utilities.processMessage(body)
    const instructions = commands.map(utilities.processCommand)

    mongo
      .write(instructions)
      .then(
        result => (result.insertedCount === instructions.length ? 200 : 500)
      )
      .then(status => response.status(status).send())

    // twilio(JSON.stringify(request.body), number).then(message => {
    // })
  } else {
    response.status(204).send()
  }
})

module.exports = app
