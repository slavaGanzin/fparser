const STATUS_OK = 200

const needle = thenify('needle')
const fs = thenify('fs')
const CACHE = 'http_cache'

fs.mkdir(CACHE).then(identity)
  .catch(identity)

const hash = value =>
  require('crypto')
    .createHash('sha256')
    .update(value, 'utf8')
    .digest()

const libxml = require('libxmljs')

const updateDocumentUrl = options => tap(document => document.url = options.url)

const parse = options => cond([[
  x => !options.parse,
  input => input.body,
], [
  x => test(/html/, x.headers['content-type']),
  input => updateDocumentUrl(options)(libxml.parseHtml(input.body)),
], [
  x => test(/rss|link-format/, x.headers['content-type']),
  input => input.body.toString(),
], [
  x => test(/xml/, x.headers['content-type']),
  input => libxml.parseXml(input.body),
], [
  T, prop('raw'),
]])

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

const request = options => {
  const _request = () => needle.request(
    options.method, options.url, options.data, merge(options, {parse: false})
  )
    .then(head)
    .then(logRequest(options))
    .then(logErrors)

  const k = `${CACHE}/${hash(options.url)}`
  //
  // const f = (!options.cached
  //   ? _request
  //   : () => fs.readFile(k)
  //     .then(JSON.parse)
  //     .catch(() => _request()
  //       .then(tap(({body, headers}) => fs.writeFile(k, JSON.stringify({body, headers}))))))
  //
  _request()
    .then(parse(options))
    .catch(logCatch(options))
}


// const mergeUrl = options => url => merge({url: defaultTo(options.url, url)}, options)

const mergeUrl = options => url =>
  merge(options, {url: defaultTo(options.url, url)})

module.exports = options =>
  flatMap(compose(request, mergeUrl(options)))
