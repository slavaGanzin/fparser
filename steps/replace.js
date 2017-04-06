const regexParser = require('regex-parser')

const parse = compose(
  ([r, s = '']) => replace(regexParser(r), s),
  split(/,?\s/)
)

module.exports = options =>
  flatMap(apply(compose, map(parse, reverse(options))))
