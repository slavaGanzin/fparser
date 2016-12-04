needle = promisify('needle')
libxml = require('libxmljs')
debugRequest = tap(compose(
  debug('body'),
  JSON.pretty,
  pick(['statusCode', 'headers'])
))

parse = when(
  x => x.body,
  input => libxml.parseHtml(input.body, {noerrors: true})
)

logErrors = when(x => x.statusCode != 200, debugRequest)

module.exports = (options) => () => {
  debug('request')(`${options.url}`)
  return needle.request(
    options.method, options.url, options.data, options
  )
  .then(logErrors)
  .then(parse)
  // .then(x => {
  //   x.toString = () => x.toString('xhtml')
  //   return x
  // }).then(console.log)
}
