const regexParser = require('regex-parser')

module.exports = (r, k) =>
  test(/^\d+$/, k)
    ? test(regexParser(r))
    : compose(test(regexParser(r)), path(split('.', k)))
