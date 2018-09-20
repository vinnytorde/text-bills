console.clear()

// environment variables
const environment = require('dotenv')
environment.config()

// express server
const server = require('./server.js')
const port = process.env.PORT || 3000
const success = () => console.log(`Serving from port ${port}`)
server.listen(port, success)
