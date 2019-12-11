const STATUS_OK = 200
const cheerio = require('cheerio')


const needle = thenify('needle')
const fs = thenify('fs')
const CACHE = require('path').resolve(`${__dirname}/../http_cache`)

fs.mkdir(CACHE).then(identity)
  .catch(identity)


// const updateDocumentUrl = options =>
//   tap(document => document.url = options.url)

const parse = options => cond([[
  x => !options.parse || test(/rss|link-format|xml/, x.headers['content-type']),
  input => input.body,
], [
  x => test(/html/, x.headers['content-type']),
  input => absoluteUrls(options.url, cheerio.load(input.body, {decodeEntities: false})),
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
  const cacheFile = `${CACHE}/${decodeURI(options.url).replace(/\//g, '∕')}`

  // console.log(cacheFile)
  const _request = () => needle.request(
    options.method, options.url, options.data, merge(options, {parse: false})
  )
    .then(head)
    .then(tap(({body, headers}) => fs.writeFile(cacheFile, JSON.stringify({body: body.toString(), headers}, null, 2))))
    .then(logRequest(options))
    .then(logErrors)


  const f = !options.cached || global.ARGV && !global.ARGV.httpCache
    ? _request
    : () => fs.readFile(cacheFile, 'utf-8')
      .then(JSON.parse)
      .then(tap(() => debug(`${options.method}:cached`)(cacheFile)))
      .catch(_request)

  return f()
    .then(parse(options))
    .catch(logCatch(options))
}


// const mergeUrl = options => url => merge({url: defaultTo(options.url, url)}, options)

const mergeUrl = options => url =>
  merge(options, {url: defaultTo(options.url, url)})

module.exports = options =>
  flatMap(compose(request, mergeUrl(options)))
