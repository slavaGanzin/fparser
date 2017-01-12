checkEmptyStep = when(is(String), objOf(__, ''))
isPlainObject = require('is-plain-object')

config = {}
parse = compose(
  ([step, options]) => require(`../steps/${step}.js`)(
    when(isEmpty, () => config[step],
    when(isPlainObject, merge(config[step]), options))
  ),
  head,
  toPairs,
  checkEmptyStep
)

_debug = ARGV.verbose > 2 ? tap(debug('debug')) : identity
_wrap = step => composeP(_debug, step, _debug, coerceArray)

parseSteps = map(compose(_wrap, parse))

run = compose(_debug, apply(composeP), reverse, parseSteps, prop('steps'))

module.exports = {
  run,
  config
}
