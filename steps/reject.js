module.exports = options =>
  apply(compose, values(mapObjIndexed(compose(reject, require('./testStringOrObject'), ([r,k]) => [regex(r),k]), options)))
