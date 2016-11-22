process.env.DEBUG = '*,'+(process.env.DEBUG||'')
global.debug = require('debug')

global.ARGV = require('commander')

R = require('ramda')
// overload = {
//   composeP: (...functions) =>
//     reduce(then, R.__, reverse(functions)),
//   compose: R.compose
// }
// R = R.merge(R, overload)
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
global.promisify = require("promisify-node")

global.coerceArray = unless(isArrayLike, of)
openPromiseArray = when(isArrayLike, Promise.all)

global.then = (promise, f) => {
  if(! is(Function, promise.then)) return Promise.resolve(f(promise))
  return promise.then(...coerceArray(f)).then(openPromiseArray)
}
