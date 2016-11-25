c2x = require('css-to-xpath')

module.exports = selector => xmldoc => {
  el = xmldoc.get(c2x(selector))
  if (! el) throw selector + ' not found'
  return el
}
