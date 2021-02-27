const {run} = require('../lib/steps')

module.exports = options =>
  flatMap(
    compose(
      then(mapObjIndexed(headIfOneElement)),
      promiseAllObject,
      evolve(mapObjIndexed(run, options)),
    ),
  )
