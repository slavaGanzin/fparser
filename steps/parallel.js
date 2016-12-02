const {run} = require('../lib/steps')

pAll = x => Promise.all(values(x)).then(zip(keys(x))).then(fromPairs)

headIfOneElement = when(x => x.length<2, head)

module.exports = options =>
flatMap(input =>
  pAll(mapObjIndexed(
    steps => run({steps})(input).then(headIfOneElement)
  , options))
)
