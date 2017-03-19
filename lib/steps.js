const checkEmptyStep = when(is(String), objOf(__, ''))
const isPlainObject = require('is-plain-object')

let config = {}
const parse = compose(
  ([step, options]) =>
    dynamicRequire(`../steps/${step}.js`)(
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

const parseSteps = map(compose(_wrap, parse))

const run = compose(
  apply(composeP),
  reverse,
  parseSteps,
  prop('steps'),
  tap(c => config = c)
)

module.exports = {run}
