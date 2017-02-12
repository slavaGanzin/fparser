module.exports = options =>
  flatMap(input => {
    placeholders = clone(input)
    if (is(String, placeholders)) {
      placeholders = mapObjIndexed(
        v => replace('$1', placeholders, v), options.placeholders)
    }
    return require('../lib/parser').parse(
      deepmerge(options, { placeholders })
    )
    .then(when(() => options.tap, () => Promise.resolve(input)))
  })
