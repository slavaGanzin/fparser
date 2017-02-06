const url = require('url')

module.exports = attr => flatMap(el => {
  if (!el.attr(attr)) return null
  let value = el.attr(attr).value()
  console.log(value)
  if (attr == 'href' && value && !url.parse(value).host) {
    console.log(value)
    // const _url = url.parse(value)
    // _url.host = el.doc().url
    // value = _url.format()
  }
  
  return value
})
