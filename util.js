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
  return /(log|pay):\s+([\w+\s]{1,})\s+\$(\d+\.?\d+)\s*(\w+)*/i.test(command)
}

// returns a map of each command and its respective amount
// a command is one of:
// log(name, cost [category]): log an unpaid bill
// pay(name, []): pay a bill
// output has schema:
// {type: String, name: String, price: Number[, category: String]}
function processCommand(command) {
  const asArray = Array.from(
    command.match(/(log|pay):\s+([\w+\s]{1,})\s+\$(\d+\.?\d+)\s*(\w+)*/i)
  )

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

module.exports = { nextFriday, processMessage, isValid, processCommand }
