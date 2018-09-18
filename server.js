const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('tiny'))

app.get('/test', function(request, response) {
  response.send({ someFancyString: 'Hello World!' })
})

app.listen(process.env.PORT || 3000)
