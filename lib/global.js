Error.stackTraceLimit = Infinity
const R = require('ramda')
const _debug = R.isEmpty(R.filter(R.test(/-v+/), process.argv))
  ? '*,-ioredis:redis'
  : '-*'
  
process.env.DEBUG = _debug+(process.env.DEBUG||'')
global.debug = require('debug')
global.ARGV = require('commander')

const cutDirname = R.replace(require('path').resolve(__dirname)+'/', '')

global.D = x => R.compose(R.tap(debug(
  cutDirname(new Error().stack.split('\n')[6])
)), (x))

const coerceArray = R.unless(R.isArrayLike, R.of)

const openPromiseArray = p =>
  (R.isArrayLike(p) && R.all(R.is(Promise), p)) 
    ? Promise.all(p)
    : p

const then = (promise, f) => {
  if(! R.is(Promise, promise)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
}

const composeP = (...functions) =>
  R.reduce(then, R.__, R.reverse(functions))

JSON.pretty = x => JSON.stringify(x, null, ' ')

const overload = R.merge(R, {
  deepmerge: require('deepmerge'),
  deepmap: R.flip(require('deep-map')),
  regex: require('regex-parser'),
  composeP,
  promiseAllObject: x => Promise.all(R.values(x)).then(R.zip(R.keys(x))).then(R.fromPairs),
  flatMap: f => R.compose(R.map(f), R.flatten),
  then,
  promisify: require("promisify-node"),
  coerceArray,
})

for (let name in overload) {
  Object.defineProperty(global, name, {
    set: ()=> {
      throw name + ' is already defined'
    },
    get: () => overload[name]
   })
}
