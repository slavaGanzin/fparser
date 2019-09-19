const $ = require('cheerio')

module.exports = attrs => flatMap(el => reduce((a, attr) => {
  if (a) return a

  if (el[attr]) return el[attr]

  return $(el).attr(attr)
  //
  // if (el[attr]) return el[attr]
  // if (!is(Function, el.attr) || !el.attr(attr)) return null
  // const value = el.attr(attr).value()
  //
  // if (attr == 'href' && value && !url.parse(value).host)
  //   return url.resolve(el.doc().url, value)
  // return value
}, null, coerceArray(attrs)))
