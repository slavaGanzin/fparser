const testStringOrObject = require('../lib/testStringOrObject')

module.exports = options =>
  apply(compose, values(mapObjIndexed(
    compose(filter, testStringOrObject),
    options)))
