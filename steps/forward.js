const {parse} = require('../lib/parser')
const {finish} = require('../lib/finish')
const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')

module.exports = hooks(options => flatMap(input => {
  const p = options.pre(input)
    .then(head)
    .then(PH.pipeline(options))
    .then(evolve({placeholders: PH.cutIndexPlaceholders}))
    .then(parse)
    .then(options.post)
    .then(headIfOneElement)
    .then(finish())

  return options.tap ? Promise.resolve(input) : p
}))
