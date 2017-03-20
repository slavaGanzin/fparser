const {runSteps} = require('../lib/steps')

const MORE_THAN_ONE = 2
const headIfOneElement = when(x => x.length < MORE_THAN_ONE, head)

module.exports = options => flatMap(input =>
  promiseAllObject(mapObjIndexed(
    steps => runSteps(steps)([input]).then(headIfOneElement)
  , options))
)
