const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(
  tap(xmldoc => map(x => x.remove(), xmldoc.find(c2x(join(', ', coerceArray(selectors))))))
  // tap(xmldoc => map(selector => mapRemove(xmldoc.find(c2x(join(', ', coerceArray(selector)))c2x(selector))), selectors))
)
