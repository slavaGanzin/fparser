module.exports = options =>
  apply(compose, values(mapObjIndexed(
    compose(reject, require('./testStringOrObject')),
  options)))
