needle = promisify('needle')
libxml = require('libxmljs')
debugRequest = tap(compose(debug('body')), pick(['statusCode', 'headers']))

module.exports = (options) => () => {
  debug('request')(`${options.url}`)
  console.log(options)
  
  return needle.request(options.method, options.url, options.data, options)
  .then(when(x => x.statusCode != 200, debugRequest))
  .then(input => libxml.parseHtml(input.body, {noerrors: true}))
  // .then(x => {
  //   x.toString = () => x.toString('xhtml')
  //   return x
  // })
}
