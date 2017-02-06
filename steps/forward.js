module.exports = options => //compose(
  flatMap(placeholders => {
    if (is(String, placeholders)) {
      placeholders = mapObjIndexed(
          (v,k) => replace('$1', placeholders, v), options.placeholders)
    }
  
    return require('../lib/parser').parse(
      deepmerge(options, { placeholders })
    )
  })
