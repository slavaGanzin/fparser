const {run} = require('../lib/steps')

const hooks = f => compose(
  f,
  merge({
    pre:  x => Promise.resolve([x]),
    post: x => [x],
  }),
  evolve({
    pre:  compose(run, debug('fparser:pre')),
    post: compose(run, debug('fparser:post')),
  }),
)

module.exports = hooks
