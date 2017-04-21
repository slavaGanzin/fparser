const toMarkdown = flip(require('breakdance'))

module.exports = options => flatMap(toMarkdown(options))
