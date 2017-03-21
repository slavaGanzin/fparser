const {parse} = require('../lib/parser')
const {runSteps} = require('../lib/steps')
const PH = require('../lib/placeholders')

const hooks = f => compose(
  f,
  merge({
    pre:          x => Promise.resolve(head(x)),
    post:         identity,
    placeholders: [],
  }),
  evolve({
    pre:  compose(runSteps, debug('fparser:pre')),
    post: runSteps,
  })
)

module.exports = hooks(options => flatMap(input =>
  options.pre([input])
    .then(debug('fparser:pre:out'))
    .then(when(isArrayLike, PH.arrayToPlaceholders))
    .then(merge(options.placeholders))
    .then(PH.selfApply)
    .then(placeholders =>
      parse(
        deepmerge(options, {placeholders})
      )
      .then(options.post)
      .then(when(() => options.tap, () => Promise.resolve(input)))
    )))
