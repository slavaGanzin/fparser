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
      ? tap(debug('fparser:limit'), ++i)
        && f()
          .then(tap(() => debug('fparser:limit')(i -= 1)))
          .then(resolve)
          .catch(reject)
      : setTimeout(_limit, 100)
    _limit()
  })

const logErrors = when(x => x.statusCode != 200, debugRequest)

module.exports = pipe(evolve({limit}), options =>
  flatMap(pipe(defaultTo(options.url), url =>
    options.limit(() =>
      needle.request(
        options.method, url, options.data, options
      )
      .then(tap(() => debug('request')(url)))
      .then(logErrors)
      .then(parse)
      .then(tap(document => document.url = url))
      .catch(x => console.log(url,x) || Promise.resolve([null]))
    )))
)
