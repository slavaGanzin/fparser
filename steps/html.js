libxml        = require('libxmljs')

module.exports = options => input =>
  libxml.parseHtml(input.body).get('//body').text()
  
