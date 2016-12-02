const {run} = require('../lib/steps')


headIfOneElement = when(x => x.length<2, head)

module.exports = options =>
flatMap(input =>
  promiseAllObject(mapObjIndexed(
    steps => run({steps})(input).then(headIfOneElement)
  , options))
)
