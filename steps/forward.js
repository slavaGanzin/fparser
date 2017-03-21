const {parse} = require('../lib/parser')
const {runSteps} = require('../lib/steps')
const hooks = f => compose(
  f,
  merge({pre: identity, post: identity}),
  evolve({pre: runSteps, post: runSteps})
)

module.exports = hooks(options =>
  flatMap(input => {
    placeholders = clone(options.pre(input))
    if (is(String, placeholders)) {
      placeholders = mapObjIndexed(
        v => replace('$1', placeholders, v), options.placeholders)
    }
    return parse(
      deepmerge(options, {placeholders})
    )
    .then(options.post)
    .then(when(() => options.tap, () => Promise.resolve(input)))
  }))
