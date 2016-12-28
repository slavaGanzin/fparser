module.exports = ([r,k]) =>
  is(Number, k)
   ? test(r)
   : compose(test(r), prop(k))
 
