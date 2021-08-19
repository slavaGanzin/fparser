const deepMap = flip(require('deep-map'))
const r = memoize(r => new RegExp(`.*${r}.*`, 'i'))

module.exports = options => flatMap(y =>
  pickBy((v, k) => !isEmpty(reject(isNil, values(v))), mapObjIndexed(pickBy(identity), deepMap((v, k) => {
    let m = slice(0, Infinity, y.match(r(v)) || [])

    if (m.length > 1) m = tail(m)

    if (!isEmpty(m)) return map(compose(trim, x => x || ''), m)
  }, options))))
