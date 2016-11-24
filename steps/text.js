c2x = require('css-to-xpath')

module.exports = selector => xmldoc => {
  if (! xmldoc.get(c2x(selector))) throw selector + ' not found'
  return xmldoc.get(c2x(selector)).text()
}
