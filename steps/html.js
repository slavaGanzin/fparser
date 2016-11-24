libxml        = require('libxmljs')

module.exports = options => input =>
  libxml.parseHtml(input.body, {errors: false})
  
