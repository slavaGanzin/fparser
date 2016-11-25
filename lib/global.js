process.env.DEBUG = '*,'+(process.env.DEBUG||'')
global.debug = require('debug')

global.ARGV = require('commander')

R = require('ramda')

openPromiseArray = R.when(R.all(x => R.is(Function, x.then)), Promise.all)
coerceArray = R.unless(R.is(Array), R.of)
then = (promise, f) => {
  if(! is(Function, promise.then)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
}

overload = {
  composeP: (...functions) =>
    reduce(then, __, reverse(functions)),
  then,
  promisify: require("promisify-node"),
  coerceArray
}
R = R.merge(R, overload)
for (let name in R) {
  if (R.contains(name, ['__'])) {
    global.__ = R.__
    continue
  }
  
  Object.defineProperty(global, name, {
    set: ()=> {
      throw name + ' is already defined'
    },
    get: () => R[name]
   })
}
