module.exports = options => flatMap(html => require('to-markdown')(html, options))
