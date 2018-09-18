const express = require('express')

const app = express()
app.get('/test', function(request, response) {
  response.send({ someFancyString: 'Hello World!' })
})

app.listen(process.env.PORT || 3000)
