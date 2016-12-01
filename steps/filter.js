module.exports = options =>
  apply(compose, map(compose(filter, test, require('./regex')), options))
