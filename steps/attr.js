const url = require('url')

module.exports = attr => flatMap(el => {
  if (!el.attr(attr)) return null
  let value = el.attr(attr).value()
  
  if (attr == 'href' && value) {
    const URL = url.parse(value)
    if (! URL.protocol) URL.protocol = url.parse(el.doc().url).protocol
    if (! URL.host) URL.host =  url.parse(el.doc().url).host
    value = URL.format()
  }
  
  return value
})
