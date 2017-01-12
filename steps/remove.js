c2x = require('css-to-xpath')

module.exports = selectors => flatMap(
  tap(xmldoc =>
    map(selector => map(x=>x.remove(), xmldoc.find(c2x(selector))), selectors))
)
