const checkEmptyStep = when(is(String), objOf(__, ''))
const isPlainObject = require('is-plain-object')

let config = null

const parse = compose(
  ([step, options]) =>
    dynamicRequire(`../steps/${step}`)(
      when(isEmpty, () => config[step],
      when(isPlainObject, merge(config[step]), options))
  ),
  head,
  toPairs,
  checkEmptyStep
)

const dropNil = when(isArrayLike, reject(isNil))

const _wrap = step => composeP(
  tap(compose(debug('debug'), x => x.toString())),
  dropNil,
  coerceArray,
  step
)

const runSteps = compose(
  apply(composeP),
  reverse,
  map(compose(_wrap, parse))
)

const run = compose(
  runSteps,
  prop('steps'),
  tap(c => config = c)
)

module.exports = {run, runSteps}
