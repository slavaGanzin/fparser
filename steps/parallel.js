const {run} = require('../lib/steps')

const headIfOneElement = when(x => x.length<2, head)

module.exports = options =>
flatMap(input =>
  promiseAllObject(mapObjIndexed(
    steps => run({steps})(input).then(headIfOneElement)
  , options))
)
