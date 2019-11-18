const $ = require('cheerio')

module.exports = attrs => flatMap(el => reduce((a, attr) => {
  if (a) return a

  if (el[attr]) return el[attr]

  return $(el).attr(attr)
}, null, coerceArray(attrs)))
