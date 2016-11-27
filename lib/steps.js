checkEmptyStep = when(is(String), assoc(__, '', {}))

parse = compose(
  step => require(`../steps/${head(keys(step))}.js`)(...values(step)),
  checkEmptyStep
)

_debug = ARGV.verbose > 1 ? tap(debug('debug')) : identity
_debug = tap(debug('debug'))
_wrap = step => composeP(step, _debug, coerceArray)

parseSteps = compose(reverse, map(compose(_wrap, parse)))

run = compose(apply(composeP), parseSteps)

module.exports = {
  run
}
