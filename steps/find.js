const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selectors => flatMap(xmldoc => {
  for (const selector of coerceArray(selectors)) {
    const e = xmldoc.find(c2x(selector))

    if (e)
      return libxmljs.parseHtmlFragment(join('\n', e.childNodes()))
  }
})
