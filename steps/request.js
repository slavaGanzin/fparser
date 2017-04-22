const STATUS_OK = 200

const needle = thenify('needle')
const libxml = require('libxmljs')

const updateDocumentUrl = options => tap(document => document.url = options.url)

const parse = options => cond([[
  x => test(/html/, x.headers['content-type']),
  input => updateDocumentUrl(options)(libxml.parseHtml(input.body)),
], [
  x => test(/rss/, x.headers['content-type']),
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

const request = options =>
  needle.request(
    options.method, options.url, options.data, options
  )
  .then(head)
  .then(logRequest(options))
  .then(logErrors)
  .then(parse(options))
  .catch(logCatch(options))

const mergeUrl = options => url => merge({url: defaultTo(options.url, url)}, options)

module.exports = options =>
  flatMap(compose(request, mergeUrl(options)))
