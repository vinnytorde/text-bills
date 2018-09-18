const express = require('express')
const morgan = require('morgan')
const mongo = require('./drivers/mongo')
const bodyParser = require('body-parser')
const app = express()

//logger middleware
app.use(morgan('tiny'))
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
  console.log(request.body)
  response.send({ test: 'you done been posted' })
})

app.get('/report/:user', function(request, response) {
  console.log(request.params.user)
  const { user } = request.params
  response.send('you are reporting for ' + user)
})

module.exports = app
