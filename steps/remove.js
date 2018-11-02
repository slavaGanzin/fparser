const c2x = unless(test(/^\/\//), require('css-to-xpath'))
const mapRemove = map(x => x.remove())

module.exports = selectors => flatMap(
  tap(xmldoc => map(selector => mapRemove(xmldoc.find(c2x(selector))), selectors))
)
