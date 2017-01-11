Error.stackTraceLimit = Infinity
R = require('ramda')
_debug = '*,-ioredis:redis'
if (R.isEmpty(R.filter(R.test(/-v+/), process.argv)))
  _debug = '-*'
  
process.env.DEBUG = _debug+(process.env.DEBUG||'')
global.debug = require('debug')
global.ARGV = require('commander')

cutDirname = R.replace(require('path').resolve(__dirname)+'/', '')

global.D = x => R.compose(R.tap(debug(
  cutDirname(new Error().stack.split('\n')[6])
)), (x))

coerceArray = R.unless(R.isArrayLike, R.of)

openPromiseArray = p =>
  (R.isArrayLike(p) && R.all(R.is(Promise), p)) ?
    Promise.all(p) : p

then = (promise, f) => {
  if(! R.is(Promise, promise)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
}

composeP = (...functions) =>
  reduce(then, R.__, R.reverse(functions))

JSON.pretty = x => JSON.stringify(x, null, ' ')

overload = {
  deepmerge: require('deepmerge'),
  deepmap: R.flip(require('deep-map')),
  regex: require('regex-parser'),
  composeP,
  promiseAllObject: x => Promise.all(R.values(x)).then(R.zip(R.keys(x))).then(R.fromPairs),
  flatMap: f => R.compose(R.map(f), R.flatten),
  then,
  promisify: require("promisify-node"),
  coerceArray,
  c2x: require('css-to-xpath'),
}
R = R.merge(R, overload)
for (let name in R) {
  Object.defineProperty(global, name, {
    set: ()=> {
      throw name + ' is already defined'
    },
    get: () => R[name]
   })
}
