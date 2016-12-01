toMarkdown = require('to-markdown')

module.exports = options => flatMap(html => toMarkdown(html, options))
