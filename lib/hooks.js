const {run} = require('../lib/steps')

const hooks = f => compose(
  f,
  merge({
    pre:  x => Promise.resolve(head(x)),
    post: identity,
  }),
  evolve({
    pre:  compose(run, debug('fparser:pre')),
    post: compose(run, debug('fparser:post')),
  })
)

module.exports = hooks
