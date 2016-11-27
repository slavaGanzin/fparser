libxml        = require('libxmljs')

module.exports = options => flatMap(input =>
  libxml.parseHtml(input.body, {errors: false}))
