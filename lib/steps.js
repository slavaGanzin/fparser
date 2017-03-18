const checkEmptyStep = when(is(String), objOf(__, ''))
const isPlainObject = require('is-plain-object')

let config = {}
const parse = compose(
  ([step, options]) => dynamicRequire(`../steps/${step}.js`)(
    when(isEmpty, () => config[step],
    when(isPlainObject, merge(config[step]), options))
  ),
  head,
  toPairs,
  checkEmptyStep
)

const _debug = tap(debug('debug'))
const _wrap = step => composeP(_debug, when(isArrayLike, reject(isNil)), step, _debug, coerceArray)

const parseSteps = map(compose(_wrap, parse))

const run = compose(_debug, apply(composeP), reverse, parseSteps, prop('steps'))

module.exports = {
  run,
  set config (_config) {
    config = _config
  }
}
