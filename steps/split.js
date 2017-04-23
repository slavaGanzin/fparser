const regexParser = require('regex-parser')

module.exports = options =>
  compose(flatten, flatMap(split(regexParser(options))))
