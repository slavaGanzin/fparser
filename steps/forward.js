const {parse} = require('../lib/parser')
const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')

const ofIfString = when(is(String), x => [x])

module.exports = hooks(options => flatMap(input => {
  const p = options.pre(input)
  .then(head)
  .then(debug('fparser:pre:out'))
  .then(ofIfString)
  .then(when(is(Array), PH.arrayToObject))
  .then(merge(options.placeholders))
  .then(PH.selfApply)
  .then(PH.cutIndexPlaceholders)
  .then(objOf('placeholders'))
  .then(merge(options))
  .then(parse)
  .then(options.post)
  .then(headIfOneElement)

  return options.tap ? Promise.resolve(input) : p
}))
