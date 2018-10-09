const constants = {
  PAY: 'pay',
  PAY_REGEX: /^pay/i,
  LOG: 'log',
  LOG_REGEX: /^log/i,
  REGISTER_REGEX: /^[R|r][E|e][G|g][I|i][S|s][T|t][E|e][R|r]:\s+(\S{1,})/,
  BILL_REGEX: /(log|pay):\s+([\w+\s]{1,})\s+\$(\d+\.?\d+)\s*(\w+)*/i
}

module.exports = constants
