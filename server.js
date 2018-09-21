const express = require('express')
const morgan = require('morgan')
const twilio = require('./drivers/twilio')
const mongo = require('./drivers/mongo')
const bodyParser = require('body-parser')
const { NUMBER } = process.env

const app = express()

//logger middleware
app.use(morgan('dev'))

//parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send({ home: 'success!' }))

app.get('/test', function(request, response) {
  mongo().then(col => {
    col.find({}).toArray((error, data) => {
      response.send({ length: data.length })
    })
  })
})

app.post('/sms', function(request, response) {
  console.log('request content is: ', request.body)
  twilio(JSON.stringify(request.body), 12102195643).then(message => {
    console.log(message.sid)
    response.status(200).send()
  })
})

app.post('/register', function(request, response) {
  const input = request.body
  response
    .status(200)
    .json({ input })
    .send()
})

module.exports = app
