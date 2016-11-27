promiseAll = require('promise-all')
steps = require('../lib/steps')

module.exports = options =>
flatMap(input =>
  promiseAll(mapObjIndexed(
    _steps => steps.run(_steps)(input)
  , options))
)
