module.exports = options =>
  apply(compose, values(mapObjIndexed(compose(reject, require('./testStringOrObject'), require('./regex')), options)))
