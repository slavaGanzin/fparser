const STATUS_OK = 200
const needle = thenify('needle')
const fs = thenify('fs')
const libxml = require('libxmljs')
const url = require('url')

const c2x = unless(test(/^\/\//), require('css-to-xpath'))

const URI2URL = (URL, xmldoc) => {
  for (const a of attributes.lazy)
    for (const x of reject(isNil, coerceArray(xmldoc.find(c2x(`[${a}]`))))) {
      if (x.attr(a).value()[0] == '#') continue
      x.attr('src', url.resolve(URL, x.attr(a).value()))
    }

  for (const a of attributes.data)
    for (const x of reject(isNil, coerceArray(xmldoc.find(c2x(`[${a}]`))))) {
      if (x.attr(a).value()[0] == '#') continue
      x.attr(a, url.resolve(URL, x.attr(a).value()))
    }

  return xmldoc
}

const parse = options => cond([[
  x => x.statusCode >= 300,
  () => null,
], [
  x => !options.parse || test(/rss|link-format|xml/, x.headers['content-type']),
  input => input.body,
], [
  x => test(/html/, x.headers['content-type']),
  input => URI2URL(options.url, libxml.parseHtml(input.body)),
// ], [
//   x => test(/xml/, x.headers['content-type']),
//   input => libxml.parseXml(input.body),
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
  fs.mkdir(options.cache).then(identity)
    .catch(identity)

  const cacheFile = `${options.cache}/${decodeURI(options.url).replace(/\//g, '∕')}`

  const drivers = {
    needle: () => needle.request(options.method, encodeURI(options.url), options.data, options.needle)
    .then(head)
    .then(tap(({body, headers, statusCode}) => fs.writeFile(cacheFile, JSON.stringify({body: body.toString(), headers, statusCode}, null, 2))))
    .then(logRequest(options))
    .then(logErrors),
    puppeteer: () => require('../lib/puppeteer').get(options)
      .then(tap(({body, headers, statusCode}) => fs.writeFile(cacheFile, JSON.stringify({body: body.toString(), headers, statusCode}, null, 2))))
  }

  const f = !options.cached || global.ARGV && global.ARGV.httpCache == false
    ? drivers[options.driver]
    : () => fs.readFile(cacheFile, 'utf-8')
      .then(JSON.parse)
      .then(tap(() => debug(`${options.method}:cached`)(cacheFile)))
      .catch(drivers[options.driver])

  return f()
    .then(parse(options))
    .catch(logCatch(options))
}


// const mergeUrl = options => url => merge({url: defaultTo(options.url, url)}, options)

const mergeUrl = options => url =>
  merge(options, {url: defaultTo(options.url, url)})

module.exports = options =>
  flatMap(compose(request, mergeUrl(options)))
