const { parse } = require('../lib/parser')

module.exports = options =>
  flatMap(input => {
    placeholders = clone(input)
    if (is(String, placeholders)) {
      placeholders = mapObjIndexed(
        v => replace('$1', placeholders, v), options.placeholders)
    }
    return parse(
      deepmerge(options, { placeholders })
    )
    .then(when(() => options.tap, () => Promise.resolve(input)))
  })
