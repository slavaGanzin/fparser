const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(xmldoc =>
  reduce((a, selector) => unless(isEmpty, x => {
    // console.error(selector)
    return reduced(x)
  }, xmldoc.find(c2x(selector))), null, coerceArray(selectors))
)
