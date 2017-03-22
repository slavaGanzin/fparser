const {parse} = require('../lib/parser')
const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')

module.exports = hooks(options => flatMap(input => {
  const p = options.pre([input])
  .then(debug('fparser:pre:out'))
  .then(when(isArrayLike, PH.arrayToObject))
  .then(merge(options.placeholders))
  .then(PH.selfApply)
  .then(PH.cutIndexPlaceholders)
  .then(objOf('placeholders'))
  .then(merge(options))
  .then(parse)
  .then(options.post)

  return options.tap ? Promise.resolve(input) : p
}))
