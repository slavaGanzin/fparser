module.exports = options =>
  apply(compose, values(mapObjIndexed(
    compose(filter, require('../lib/testStringOrObject')),
  options)))
