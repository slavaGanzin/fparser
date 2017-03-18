const toMarkdown = flip(require('to-markdown'))

module.exports = options => flatMap(toMarkdown(options))
