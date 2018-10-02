const express = require('express')
const morgan = require('morgan')
const twilio = require('./drivers/twilio')
const mongo = require('./drivers/mongo')
const utilities = require('./util')
const bodyParser = require('body-parser')

const app = express()

//logger middleware
app.use(morgan('dev'))

//parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//test API
app.get('/', (req, res) => res.send({ home: 'Bills API is live!' }))

//logging a bill. Only gets called by Twilio
app.post('/sms', function(request, response) {
  const { To: to, From: from, Body: body } = request.body
  const commands = utilities.processMessage(body)
  commands.forEach(utilities.processCommand)
  response.status(200).send()

  // twilio(JSON.stringify(request.body), number).then(message => {
  //   console.log(message.sid)
  //   response.status(200).send()
  // })
})

module.exports = app
