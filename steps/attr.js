const url = require('url')

const resolveIfUrl = when(
  (value, attr) => attr == 'href' && value && !url.parse(value).host,
  value => url.resolve(el.doc().url, value)
)

module.exports = attr => flatMap(el => {
  if (el[attr]) return el[attr]
  if (!el.attr(attr)) return null
  return resolveIfUrl(el.attr(attr).value())
})
