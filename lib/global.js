// process.env.DEBUG = '*,-needle'+(process.env.DEBUG||'')
global.debug = require('debug')
global.ARGV = require('commander')

R = require('ramda')

cutDirname = R.replace(require('path').resolve(__dirname)+'/', '')

global.D = x => R.compose(R.tap(debug(
  cutDirname(new Error().stack.split('\n')[6])
)), (x))

coerceArray = R.unless(R.isArrayLike, R.of)

openPromiseArray = p => {
  if (R.isArrayLike(p) && R.all(R.is(Promise), p))
    return Promise.all(p)
  return p
}

then = (promise, f) => {
  if(! R.is(Promise, promise)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
}

composeP = (...functions) =>
  reduce(then, R.__, R.reverse(functions))

overload = {
  deepmerge: require('deepmerge'),
  deepmap: R.flip(require('deep-map')),
  composeP,
  flatMap: f => R.compose(R.map(f), R.flatten),
  then,
  promisify: require("promisify-node"),
  coerceArray,
  c2x: require('css-to-xpath')
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
