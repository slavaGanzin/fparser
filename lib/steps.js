const checkEmptyStep = when(is(String), objOf(__, ''))
const isPlainObject = require('is-plain-object')

let config = {}
const parse = compose(
  ([step, options]) => require(`../steps/${step}.js`)(
    when(isEmpty, () => config[step],
    when(isPlainObject, merge(config[step]), options))
  ),
  head,
  toPairs,
  checkEmptyStep
)

const _debug = ARGV.verbose > 2 ? tap(debug('debug')) : identity
const _wrap = step => composeP(_debug, reject(isNil), step, _debug, coerceArray)

const parseSteps = map(compose(_wrap, parse))

const run = compose(_debug, apply(composeP), reverse, parseSteps, prop('steps'))

module.exports = {
  run,
  set config(_config) {
    config = _config
  }
}
