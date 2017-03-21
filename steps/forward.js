const {parse} = require('../lib/parser')
const {runSteps} = require('../lib/steps')
const PH = require('../lib/placeholders')

const hooks = f => compose(
  f,
  merge({
    pre:  x => Promise.resolve(head(x)),
    post: identity,
  }),
  evolve({
    pre:  compose(runSteps, debug('fparser:pre')),
    post: runSteps,
  })
)

module.exports = hooks(options => flatMap(input => {
  const p = options.pre([input])
  .then(debug('fparser:pre:out'))
  .then(when(isArrayLike, PH.arrayToObject))
  .then(merge(options.placeholders))
  .then(PH.selfApply)
  .then(placeholders => merge(options, {placeholders}))
  .then(parse)
  .then(options.post)

  return options.tap ? Promise.resolve(input) : p
}))
