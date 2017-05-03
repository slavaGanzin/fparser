const {run} = require('../lib/steps')

module.exports = options =>
  flatMap(
    compose(
      then(__, mapObjIndexed(headIfOneElement)),
      promiseAllObject,
      evolve(mapObjIndexed(run, options))
    )
  )
