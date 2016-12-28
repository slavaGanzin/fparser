module.exports = options =>
  apply(compose, values(mapObjIndexed(compose(filter, require('./testStringOrObject'), require('./regex')), options)))
