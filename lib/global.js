// require('pretty-error').start()
Error.stackTraceLimit = Infinity
process.env.DEBUG_DEPTH = 20
const R = require('ramda')
const deepmerge = require('deepmerge')
const deepmap = R.flip(require('deep-map'))
const thenify = R.compose(require("thenify-all"), require)

const url = require('url')
const attributes = {
  data: ['href', 'src', 'codebase', 'cite', 'background', 'action', 'profile', 'formaction', 'icon', 'manifest', 'archive', 'data-src', 'data-href', 'data-lazy-src', 'src-defer', 'href-defer'],
  lazy: ['data-src', 'data-lazy-src', 'src-defer'],
}

const absoluteUrls = (URL, $) => {
  const {protocol, host} = url.parse(URL)

  for (const a of attributes.lazy)
    $(`[${a}]`).map((i, x) => $(x).attr('src', $(x).attr(a)))

  for (const a of attributes.data)
    $(`[${a}]`).map((i, x) => $(x).attr(a, url.resolve(`${protocol}//${host}`, $(x).attr(a))))

  return $
}

const ARGV = require('commander')
const {D, debug} = require('./debug')

const coerceArray = R.unless(R.isArrayLike, R.of)

const openPromiseArray = p =>
  R.isArrayLike(p) && R.all(R.is(Promise), p)
    ? Promise.all(p)
    : p

const then = R.curry((f, promise) => {
  if (!promise || !R.is(Promise, promise)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
})

global.pCompose = (...functions) =>
  reduce(flip(then), __, reverse(functions))

JSON.pretty = x => JSON.stringify(x, null, ' ')

const MORE_THAN_ONE = 2
const headIfOneElement = R.when(x => x.length < MORE_THAN_ONE, R.head)

const overload = R.merge(R, {
  deepmerge,
  deepmap,
  pCompose,
  debug,
  promiseAllObject: x =>
    Promise.all(R.values(x))
      .then(R.zip(R.keys(x)))
      .then(R.fromPairs),
  flatMap:        f => R.compose(R.map(f), R.flatten),
  then,
  thenify,
  coerceArray,
  openPromiseArray,
  D,
  ARGV,
  headIfOneElement,
  pp:             R.compose(process.stdout.write.bind(process.stdout), require('prettyjson').render),
  dotPath:        R.compose(R.path, R.split('.')),
  dynamicRequire: R.memoize(R.compose(require, debug('fparser:require'))),
  absoluteUrls,
  attributes,
})

for (let name in overload) {
  Object.defineProperty(global, name, {
    set: () => {
      throw new Error(`${name} is already defined`)
    },
    get: () => overload[name],
  })
}

// global.locus = require('locus')
