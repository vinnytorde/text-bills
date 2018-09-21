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
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send({ home: 'success!' }))
app.post('/', (request, response) => {
  const { foo } = request.body
  console.log('Heres foo, fool:', foo)
  console.log('Heres the rest', request.body)
  response.send(foo)
})

app.get('/test', function(request, response) {
  mongo().then(col => {
    col.find({}).toArray((error, data) => {
      response.send({ length: data.length })
    })
  })
})

app.post('/bill', function(request, response) {
  const { name } = request.body
  const body = `${name} has paid a bill!`
  twilio(body, 2102195643).then(message => {
    response.send({ id: message.sid, body: message.body })
  })
})

app.get('/report/:user', function(request, response) {
  const { user } = request.params
  response.send('you are reporting for ' + user)
})

app.post('/register', function(request, response) {
  const input = request.body
  response
    .status(200)
    .json({ input })
    .send()
})

module.exports = app
