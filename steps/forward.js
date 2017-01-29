module.exports = options => //compose(
  flatMap(placeholders => {
    // console.log(input)
    if (is(String, placeholders))
        placeholders = mapObjIndexed(
          (v,k) => replace('$1', placeholders, v), options.placeholders)
    // console.log(options.placeholders)
  
    return require('../lib/parser').parse(
      deepmerge(options, { placeholders })
    )
  })
// }))
