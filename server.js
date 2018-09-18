const express = require('express')
const morgan = require('morgan')
const mongo = require('./drivers/mongo')
const app = express()

//logger
app.use(morgan('tiny'))

app.get('/test', function(request, response) {
  mongo('test').then(col => {
    col.find({}).toArray((error, data) => {
      console.log(data.length)

      response.send({ length: data.length })
    })
  })
})

module.exports = app
