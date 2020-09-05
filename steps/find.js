const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(xmldoc =>
  reduce((a, x) => a || when(isEmpty, always(a), xmldoc.find(c2x(x))), null, coerceArray(selectors))
)
