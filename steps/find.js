c2x = require('css-to-xpath')

module.exports = selector => map(docs => {
  console.log(docs)
  return Promise.resolve(1)
  // return map(xmldoc => {
  //   el = xmldoc.find(c2x(selector))
  //   if (! el) throw selector + ' not found'
  //   return el
  // }, coerceArray(docs))
})
