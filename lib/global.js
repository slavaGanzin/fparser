Error.stackTraceLimit = Infinity
process.env.DEBUG_DEPTH = 20
const R = require('ramda')
const Path = require('path')
const deepmerge = require('deepmerge')
const deepmap = R.flip(require('deep-map'))
const promisify = R.compose(require("promisify-node"), require)
const ARGV = require('commander')

const verbosity = R.reject(R.isEmpty, R.map(R.match(/-v+/g), process.argv)).toString().length
const VERBOSITY_LEVELS = [
  'error*,request*',
  'error*',
  'error*,request*,skip*',
  'error*,request*,skip*,fparser:*',
  'error*,request*,skip*,fparser:*,debug*,needle*',
  'error*,request*,skip*,fparser:*,debug*',
  '*',
]

process.env.DEBUG = VERBOSITY_LEVELS[verbosity] + (process.env.DEBUG || '')
const debug = R.compose(R.tap, R.memoize(require('debug')))

const cutDirname = R.replace(
  Path.resolve(__dirname.replace(/lib$/, '')), '')

const ERROR_LINE = 8
const logFile = msg => R.tap(x => debug(`debug:${msg}`)(
  `${cutDirname(new Error().stack.split('\n')[ERROR_LINE])} ${msg}`, x)
)

const D = f => R.compose(logFile('out'), f, logFile('in'))

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
  promisify,
  coerceArray,
  openPromiseArray,
  D,
  ARGV,
  dynamicRequire: require,
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
