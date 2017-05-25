const {run} = require('../lib/steps')

const LIMIT_TIMEOUT = 100
const START = 0

const limit = (lim, i = START) => f =>
  new Promise((resolve, reject) => {
    const _limit = () => i < parseInt(lim)
      ? tap(debug('limit'), ++i)
        && f()
          .then(tap(() => debug('limit')(--i)))
          .then(resolve)
          .catch(reject)
      : setTimeout(_limit, LIMIT_TIMEOUT)

    _limit()
  })

module.exports = options =>
  compose(
    limit(options.limit),
    flatMap(run(options.steps))
  )
