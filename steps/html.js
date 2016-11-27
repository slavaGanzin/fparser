libxml        = require('libxmljs')

module.exports = options => map(input =>
  libxml.parseHtml(input.body, {errors: false}))
