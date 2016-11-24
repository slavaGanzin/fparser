c2x = require('css-to-xpath')

module.exports = text => xmldoc =>
  xmldoc.find(c2x(select))
