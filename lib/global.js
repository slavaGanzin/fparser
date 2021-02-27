Error.stackTraceLimit = Infinity
process.env.DEBUG_DEPTH = 20

process.env.DEBUG = '-*'

Error.stackTraceLimit = Infinity

require('fast-require')({
  toRoot:  ['ramda'],
  without: ['debug'],
  global:  true,
  install: true,
  search:  [require('path').resolve(`${__dirname}/..`)],
  patch:   {
    debug: () => () => () => {},
  },
})

global.debug = compose(tap, require('debug'))
global.thenify = compose(thenifyAll, require)

global.attributes = {
  data: ['href', 'src', 'codebase', 'cite', 'background', 'action', 'profile', 'formaction', 'icon', 'manifest', 'archive', 'data-src', 'data-href', 'data-lazy-src', 'src-defer', 'href-defer'],
  lazy: ['data-src', 'data-lazy-src', 'src-defer'],
}

// global.absoluteUrls = (URL, $) => {
//   const {protocol, host} = url.parse(URL)
//
//   for (const a of attributes.lazy) {
//     $(`[${a}]`).map((i, x) => {
//       if ($(x).attr(a)[0] == '#') return
//       $(x).attr('src', $(x).attr(a))
//     })
//   }
//
//   for (const a of attributes.data) {
//     $(`[${a}]`).map((i, x) => {
//       if ($(x).attr(a)[0] == '#') return
//       $(x).attr(a, url.resolve(`${protocol}//${host}`, $(x).attr(a)))
//     })
//   }
//
//   return $
// }

global.ARGV = require('commander')
// const {D, debug} = require('./debug')

global.coerceArray = unless(isArrayLike, of)

const openPromiseArray = p =>
  isArrayLike(p) && all(is(Promise), p)
    ? Promise.all(p)
    : p

global.then = curry((f, promise) => {
  if (!promise || !is(Promise, promise)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
})

global.pCompose = (...functions) =>
  reduce(flip(then), __, reverse(functions))

const {highlight} = require('cli-highlight')


global.pp = tap(x =>
  process.stdout.write(`${prettyjson.render(mapObjIndexed(x => is(Object, x) ? x : highlight(String(x)), x) || 'undefined', {
    dashColor: 'grey',
    noColor:   true,
  })}\n`))

global.po = tap(x =>
  process.stdout.write(`${prettyjson.render(x || 'undefined', {
    keysColor: 'yellow',
    dashColor: 'grey',
  })}\n`))

global.pe = tap(x =>
  process.stderr.write(`${prettyjson.render(x || 'undefined', {
    keysColor: 'red',
    dashColor: 'grey',
  })}\n`))

global.promiseAllObject = x =>
  Promise.all(values(x))
    .then(zip(keys(x)))
    .then(fromPairs)

global.headIfOneElement = when(x => x.length < 2, head)
global.flatMap = f => compose(map(f), flatten)
