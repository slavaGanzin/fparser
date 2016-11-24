c2x = require('css-to-xpath')

module.exports = text => xmldoc =>
  xmldoc.find('./body')
  // xmldoc.find('contains text ".satan." using wildcards')
