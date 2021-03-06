const utilities = require('./../util')

describe('utilities', function() {
  describe('nextFriday', function() {
    it('handles no date being passed', () => {
      const input = undefined
      const output = Date
      expect(utilities.nextFriday(input)).toBeInstanceOf(output)
    })
    it('handles a date being passed', () => {
      const input = '01/24/1994'
      const output = Date
      expect(utilities.nextFriday(input)).toBeInstanceOf(output)
    })
  })

  describe('processMessage', function() {
    it('splits a message based on line breaks', () => {
      const input = 'log: lunch $10 food\npay: lunch $10.00 food'
      const output = ['log: lunch $10 food', 'pay: lunch $10.00 food']
      expect(utilities.processMessage(input)).toEqual(output)
    })

    it('returns an array even when only 1 command is passed in', () => {
      const input = 'log: lunch $10 food'
      const output = 1
      expect(utilities.processMessage(input).length).toEqual(output)
    })

    it('handles line breaks gracefully with a single command', () => {
      const input = '\nlog: lunch $10 food\n'
      const output = ['log: lunch $10 food']
      expect(utilities.processMessage(input)).toEqual(output)
    })

    it('handles line breaks gracefully with multiple commands', () => {
      const input = '\nlog: lunch $10 food\n\n\npay: lunch $10.00 food\n'
      const output = ['log: lunch $10 food', 'pay: lunch $10.00 food']
      expect(utilities.processMessage(input)).toEqual(output)
    })
  })

  describe('isValid', function() {
    it('handles structure :action :name :price [:category]', () => {
      const input = 'log: lunch $10 food'
      const output = true
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('handles action: pay', () => {
      const input = 'pay: lunch $10 food'
      const output = true
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('handles action: log', () => {
      const input = 'log: lunch $10 food'
      const output = true
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('fails if there is action', () => {
      const input = 'lunch 10 food'
      const output = false
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('fails on actions other than pay or log', () => {
      const input = 'derp: lunch $10 food'
      const output = false
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('fails if there is no name', () => {
      const input = 'log: $10.00'
      const output = false
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('fails if there is no price', () => {
      const input = 'log: lunch 10 food'
      const output = false
      expect(utilities.isValid(input)).toEqual(output)
    })

    it('works if there is no category, as it is optional', () => {
      const input = 'log: lunch $10.00'
      const output = true
      expect(utilities.isValid(input)).toEqual(output)
    })
  })

  describe('processCommand', function() {
    it('returns a linked object of a command', () => {
      const input = 'log: lunch $10.00 test'
      const output = {
        type: 'log',
        name: 'lunch',
        price: 10,
        category: 'test',
        paid: false
      }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('appends paid: false in log type bill', () => {
      const input = 'log: lunch $10'
      const output = { type: 'log', name: 'lunch', price: 10, paid: false }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('appends paid: true in pay type bill', () => {
      const input = 'pay: lunch $10'
      const output = { type: 'pay', name: 'lunch', price: 10, paid: true }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('handles multi-word names', () => {
      const input = 'log: lunch with my friends $10.00 test'
      const output = {
        type: 'log',
        name: 'lunch with my friends',
        price: 10,
        category: 'test',
        paid: false
      }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('handles floating point price', () => {
      const input = 'log: lunch with my friends $10.01 test'
      const output = {
        type: 'log',
        name: 'lunch with my friends',
        price: 10.01,
        category: 'test',
        paid: false
      }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('handles non-floating point price', () => {
      const input = 'log: lunch $10 test'
      const output = {
        type: 'log',
        name: 'lunch',
        price: 10,
        category: 'test',
        paid: false
      }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('handles missing optional category', () => {
      const input = 'log: lunch $10'
      const output = { type: 'log', name: 'lunch', price: 10, paid: false }
      expect(utilities.processCommand(input)).toEqual(output)
    })

    it('handles present optional category', () => {
      const input = 'log: lunch $10 category'
      const output = {
        type: 'log',
        name: 'lunch',
        price: 10,
        category: 'category',
        paid: false
      }
      expect(utilities.processCommand(input)).toEqual(output)
    })
  })

  describe('isRegisterText', function() {
    it('handles a correct message structure: register: password', () => {
      const input = 'register: password'
      const output = true
      expect(utilities.isRegisterText(input)).toEqual(output)
    })

    it('handles handles incorrect structure: register: password', () => {
      const input = 'uhhh... password'
      const output = false
      expect(utilities.isRegisterText(input)).toEqual(output)
    })
  })

  describe('processRegisterText', function() {
    it('returns a password when fed the correct input', () => {
      const input = 'register: password'
      const output = true
      expect(utilities.isRegisterText(input)).toEqual(output)
    })

    it('handles all non-whitespace characters in password', () => {
      const input = 'register: []()!@#$%^&*()1234567890abc'
      const output = '[]()!@#$%^&*()1234567890abc'
      expect(utilities.processRegisterText(input)).toEqual(output)
    })
  })
})
