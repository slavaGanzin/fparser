const url = require('url')

module.exports = attr => flatMap(el => {
  if (!el.attr(attr)) return null
  let value = el.attr(attr).value()

  if (attr == 'href' && value && !url.parse(value).host) value = url.resolve(el.doc().url, value)

  return value
})
