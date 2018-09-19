const express = require('express')
const morgan = require('morgan')
const twilio = require('./drivers/twilio')
const mongo = require('./drivers/mongo')
const bodyParser = require('body-parser')

const app = express()

//logger middleware
app.use(morgan('dev'))
//parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/test', function(request, response) {
  mongo().then(col => {
    col.find({}).toArray((error, data) => {
      response.send({ length: data.length })
    })
  })
})

app.post('/bill', function(request, response) {
  const { name } = request.body
  const vinny = 2102195643
  const to = vinny
  const body = `${name} has paid a bill!`
  twilio(to, body).then(message => {
    response.send({ vinny, body, name })
  })
})

app.get('/report/:user', function(request, response) {
  const { user } = request.params
  response.send('you are reporting for ' + user)
})

module.exports = app
