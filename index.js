// environment variables
const environment = require('dotenv')
environment.config()

// express server
const server = require('./server.js')
server.listen(process.env.PORT || 3000)
