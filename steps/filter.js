regex = r => new RegExp(split('/', r)[1], split('/', r)[2])

module.exports = options =>
  apply(compose, map(compose(filter, test, regex), options))
