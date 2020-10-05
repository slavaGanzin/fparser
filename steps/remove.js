const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(
  tap(xmldoc => map(selector => map(x => {
    if (global.verbosity > 0) pp({[`remove ${selector}`]: x.toString()})
    x.remove()
  }, xmldoc.find(c2x(selector))), coerceArray(selectors)))
)
