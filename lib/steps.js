checkEmptyStep = when(is(String), assoc(__, '', {}))

parse = compose(
  step => require(`../steps/${head(keys(step))}.js`)(...values(step)),
  checkEmptyStep
)

_debug = ARGV.verbose > 1 ? tap(debug('debug')) : identity
_debug = tap(debug('debug'))
_wrap = step => composeP(_debug, step, _debug, coerceArray)

parseSteps = map(compose(_wrap, parse))

run = compose(_debug, apply(composeP), reverse, parseSteps, prop('steps'))

module.exports = {
  run
}
