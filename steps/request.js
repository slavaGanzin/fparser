const STATUS_OK = 200
const LIMIT_TIMEOUT = 100
const NIL = 0

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
  input => libxml.parseHtml(input.body, {noerrors: true })
)
const limit = (lim, i = NIL) => f =>
  new Promise((resolve, reject) => {
    const _limit = () => i < parseInt(lim)
      ? tap(debug('fparser:limit'), ++i)
        && f()
          .then(tap(() => debug('fparser:limit')(--i)))
          .then(resolve)
          .catch(reject)
      : setTimeout(_limit, LIMIT_TIMEOUT)

    _limit()
  })

const logErrors = when(x => x.statusCode != STATUS_OK, debugRequest)

module.exports = pipe(evolve({limit }), options =>
  compose(reject(isNil),
    flatMap(pipe(defaultTo(options.url), url =>
      options.limit(() =>
        needle.request(
          options.method, url, options.data, options
        )
        .then(tap(() => debug('request')(url)))
        .then(logErrors)
        .then(parse)
        .then(tap(document => {
          document.url = url
        }))
        .catch(x => debug('error:request')(url, x) || Promise.resolve([null]))
    ))))
)
