R = require('ramda')
// function* arrayToGen(array) {
//   for (let i in array) {
//     // if (R.is(Promise, array[i]))
//     // array[i] = (async function() {
//     //   await array[i]
//     // })()
//     yield array[i]
//   }
//   return
// }
//
// g = arrayToGen([Promise.resolve(1),2,3])
// console.log(g.next().value)
// return
//
// function* gen(f, g) {
//   if (R.isArrayLike(g)) g = arrayToGen(g)
//   if (!g.next) g = g()
//   while(true) {
//     let {done, value} = g.next()
//     if (done) return
//     yield f(value)
//   }
// }
//
// const composeG = (...functions) =>
//   R.reduce(R.flip(gen), R.__, R.reverse(functions))
//
// g = composeG(
//   x => x/2,
//   x => x+1
// )([1,2,3])
// g.next()
//
// g = gen(x => x+1, gen(x => x+1, [1,2,3]))
// g.next()

inASecond = new Promise(r => setTimeout(r, 2000))
a = [Promise.resolve(1), inASecond]
Promise.all(a).then(console.log)
a.push(inASecond)
