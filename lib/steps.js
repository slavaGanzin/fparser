const checkEmptyStep = when(is(String), objOf(__, ''))
const isPlainObject = require('is-plain-object')

let config = null
const deepmap = flip(require('deep-map'))

const parse = compose(
  ([step, options]) => [
    step,
    require(`../steps/${step}`)(
      when(isEmpty, () => config[step],
        when(isPlainObject, merge(config[step]), options))
    )],
  head,
  toPairs,
  checkEmptyStep
)

const dropNil = when(isArrayLike, reject(isNil))


require('./debug')

const _wrap = ([name, step]) => pCompose(
  dropNil,
  step,
  coerceArray,
)


const run = compose(
  apply(pCompose),
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
