module.exports = options =>
  apply(compose, values(mapObjIndexed(
    compose(reject, require('../lib/testStringOrObject')),
  options)))
