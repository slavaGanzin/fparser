const deepMap = flip(require('deep-map'))
const r = memoize(r => new RegExp(r, 'gim'))

module.exports = options => flatMap(y => pickBy((v, k) => !isEmpty(reject(isNil, values(v))), mapObjIndexed(pickBy(identity), deepMap((v, k) => {
  const m = y.match(r(v))

  if (m) return m
}, options))))
