//https://github.com/koichik/node-tunnel
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

const limit = (limit, i=0) => f =>
  new Promise((resolve, reject) => {
    const _limit = () => i < parseInt(limit)
      ? ++i && f().then(tap(() => i = --i)).then(resolve).catch(reject)
      : setTimeout(_limit, 100)
    _limit()
  })

const logErrors = when(x => x.statusCode != 200, debugRequest)

module.exports = options => {
  l = limit(options.limit)
  return skip => {
    if (head(skip)) {
      // console.error('skipped', options.url)
      return Promise.resolve([])
    }
    return l(() =>
    console.error('request', options.url)
    ||
    needle.request(
      options.method, options.url, options.data, options
    ))
    .then(logErrors)
    .then(parse)
    .then(tap(document => document.url = options.url))
    .then(coerceArray)
    .catch(x => console.log(options.url,x) || Promise.resolve([null]))
}}
