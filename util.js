const constants = require('./constants')

// returns the date object of when next friday will be, at 4pm
function nextFriday(date = new Date()) {
  if (!(date instanceof Date)) date = new Date(date)
  //what day of the week it is
  const today = date.getDay()
  //since friday is always 5
  const daysTillFriday = 5 - today
  const nextFriday = new Date()
  nextFriday.setDate(date.getDate() + daysTillFriday)
  nextFriday.setHours(16, 0, 0)
  return nextFriday
}

// returns a string split into single line commands
// delimiter is a carriage return, \n
function processMessage(input) {
  return input.split('\n').filter(str => str !== '')
}

// determines if a command meets the required format:
// type: name price[ category]
function isValid(command) {
  return constants.BILL_REGEX.test(command)
}

// returns a map of each command and its respective amount
// a command is one of:
// log(name, cost [category]): log an unpaid bill
// pay(name, []): pay a bill
// output has schema:
// {type: String, name: String, price: Number[, category: String]}
function processCommand(command) {
  const asArray = Array.from(command.match(constants.BILL_REGEX))

  // first match is always the whole command, so we remove it
  // from there, matches are organized in order of keys
  asArray.shift()
  const linkedMap = {}
  linkedMap.type = asArray.shift()
  if (constants.PAY_REGEX.test(linkedMap.type)) {
    linkedMap.paid = true
  } else {
    linkedMap.paid = false
  }
  linkedMap.name = asArray.shift()
  linkedMap.price = Number(asArray.shift())

  if (asArray[0]) linkedMap.category = asArray.shift()
  return linkedMap
}

// validates that the text starts with the word register,
// and captures the password that follows it.
// a register text follows this format:
// register: password
function isRegisterText(input) {
  return constants.REGISTER_REGEX.test(input)
}

// returns the password from the register text.
function processRegisterText(input) {
  return input.match(constants.REGISTER_REGEX)[1]
}

module.exports = {
  nextFriday,
  processMessage,
  isValid,
  isRegisterText,
  processCommand,
  processRegisterText
}
