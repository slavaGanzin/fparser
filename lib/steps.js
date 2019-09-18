const checkEmptyStep = when(is(String), objOf(__, ''))
const isPlainObject = require('is-plain-object')

let config = null

const parse = compose(
  ([step, options]) => [
    step,
    dynamicRequire(`../steps/${step}`)(
      when(isEmpty, () => config[step],
        when(isPlainObject, merge(config[step]), options))
    )],
  head,
  toPairs,
  checkEmptyStep
)

const dropNil = when(isArrayLike, reject(isNil))

const _wrap = ([name, step]) => composeP(
  // tap(map(compose(debug(`debug:${name}`), pretty))),
  dropNil,
  step,
  coerceArray
)

const run = compose(
  apply(composeP),
  reverse,
  map(compose(_wrap, parse)),
  reject(equals('null')),
)

const runConfig = compose(
  run,
  prop('steps'),
  tap(c => config = c)
)

module.exports = {run, runConfig}
