const express = require('express')
const morgan = require('morgan')

const app = express()

//logger
app.use(morgan('tiny'))

app.get('/test', function(request, response) {
  response.send({ someFancyString: 'Hello World!' })
})

module.exports = app
