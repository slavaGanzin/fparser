Error.stackTraceLimit = Infinity
process.env.DEBUG_DEPTH = 20
const R = require('ramda')
const deepmerge = require('deepmerge')
const deepmap = R.flip(require('deep-map'))
const thenify = R.compose(require("thenify-all"), require)

const ARGV = require('commander')
const {D, debug} = require('./debug')

const coerceArray = R.unless(R.isArrayLike, R.of)

const openPromiseArray = p =>
  R.isArrayLike(p) && R.all(R.is(Promise), p)
    ? Promise.all(p)
    : p

const then = R.curry((promise, f) => {
  if (!promise || !R.is(Promise, promise)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
})

const composeP = (...functions) =>
  R.reduce(then, R.__, R.reverse(functions))

JSON.pretty = x => JSON.stringify(x, null, ' ')

const overload = R.merge(R, {
  deepmerge,
  deepmap,
  composeP,
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
  dynamicRequire: R.memoize(R.compose(require, debug('fparser:require'))),
})

for (let name in overload) {
  Object.defineProperty(global, name, {
    set: () => {
      throw new Error(`${name} is already defined`)
    },
    get: () => overload[name],
  })
}

global.locus = require('locus')
