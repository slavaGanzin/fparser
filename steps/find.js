const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(xmldoc =>
  map(x => xmldoc.find(c2x(x)), coerceArray(selectors))
)
