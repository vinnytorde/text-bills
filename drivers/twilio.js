const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = process.env
const client = require('twilio')(TWILIO_SID, TWILIO_AUTH_TOKEN)

function driver(body, to, from = TWILIO_PHONE) {
  return client.messages.create({ from, to, body })
}

module.exports = driver
