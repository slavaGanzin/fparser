module.exports = options =>
  apply(compose, map(compose(reject, test, require('./regex')), options))
