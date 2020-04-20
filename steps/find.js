const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(xmldoc => {
  for (const selector of coerceArray(selectors)) {
    const e = xmldoc.get(c2x(selector))

    if (e) return e
  }
})
