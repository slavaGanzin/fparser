const needle = promisify('needle')
const libxml = require('libxmljs')
const debugRequest = tap(compose(
  debug('body'),
  JSON.pretty,
  pick(['statusCode', 'headers'])
))

const parse = when(
  x => x.body,
  input => libxml.parseHtml(input.body, {noerrors: true})
)

const logErrors = when(x => x.statusCode != 200, debugRequest)

module.exports = options => input => {
  if (isEmpty(reject(equals(false), input)))
    return Promise.reject(`skipped ${options.url}`)
  
  debug('request')(`${options.url}`)
  return needle.request(
    options.method, options.url, options.data, options
  )
  .then(logErrors)
  .then(parse)
  .then(coerceArray)
}
