promiseAll = require('promise-all')
steps = require('../lib/steps')

// pAll = x => Promise.all(values(x)).then(zip(keys(x))).then(fromPairs)

headIfOneElement = when(x => x.length<2, head)

module.exports = options =>
map(input =>
  promiseAll(mapObjIndexed(
    _steps => steps.run(_steps)(input)//.then(headIfOneElement)
  , options))
)
