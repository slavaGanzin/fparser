process.env.DEBUG = '*'+process.env.DEBUG
global.debug = require('debug')

global.ARGV = require('commander')
R = require('ramda')
for (let name in R) {
  global[name] = R[name]
}
global.promisify = require("promisify-node")

global.coerceArray = unless(isArrayLike, of)
openPromiseArray = when(isArrayLike, Promise.all)

global.then = (promise, f) => {
  if(! R.is(Function, promise.then)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
}

global.composeP = (...functions) =>
  reduce(then, R.__, reverse(functions))
  
