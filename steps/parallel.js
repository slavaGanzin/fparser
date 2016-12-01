promiseAll = require('promise-all')
const {run} = require('../lib/steps')

pAll = x => Promise.all(values(x)).then(zip(keys(x))).then(fromPairs)

headIfOneElement = when(x => x.length<2, head)

module.exports = options =>
flatMap(input =>
  promiseAll(mapObjIndexed(
    steps => run({steps})(input).then(headIfOneElement)
  , options))
)
