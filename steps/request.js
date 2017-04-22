const STATUS_OK = 200
const LIMIT_TIMEOUT = 100
const NIL = 0

//https://github.com/koichik/node-tunnel
const needle = require('promisify-node')('needle')
const libxml = require('libxmljs')

const updateDocumentUrl = options => tap(document => document.url = options.url)

const parse = options => cond([[
  x => test(/html/, x.headers['content-type']),
  input => updateDocumentUrl(options)(libxml.parseHtml(input.body)),
], [
  x => test(/xml|rss/, x.headers['content-type']),
  input => libxml.parseXml(input.body),
], [
  T, prop('raw'),
]])

const limit = (lim, i = NIL) => f =>
  new Promise((resolve, reject) => {
    const _limit = () => i < parseInt(lim)
      ? tap(debug('limit'), ++i)
        && f()
          .then(tap(() => debug('limit')(--i)))
          .then(resolve)
          .catch(reject)
      : setTimeout(_limit, LIMIT_TIMEOUT)

    _limit()
  })

const debugRequest = tap(compose(
  debug('body'),
  pick(['statusCode', 'headers'])
))
const logErrors = when(x => x.statusCode != STATUS_OK, debugRequest)
const logRequest = options => debug(options.method)(options.url)
const logCatch = options => x => {
  debug(`error:${options.method} ${options.url}`)(x.message)
  return Promise.resolve(null)
}

const request = options =>
options.limit(() => {
  if (!options.url) return Promise.resolve(null)
  return needle.request(
    options.method, options.url, options.data, options
  )
  .then(logRequest(options))
  .then(logErrors)
  .then(parse(options))
  .catch(logCatch(options))
})

const mergeUrl = options => url => merge({url: defaultTo(options.url, url)}, options)

module.exports = pipe(evolve({limit}), options =>
  flatMap(compose(request, mergeUrl(options))))
