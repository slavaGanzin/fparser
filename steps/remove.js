const $ = require('cheerio')

module.exports = selectors => flatMap(tap(e =>
  map(s => $(s, e).remove(), selectors)
))
