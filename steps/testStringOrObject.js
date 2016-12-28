module.exports = ([r,k]) =>
  test(/^\d+$/, k)
   ? test(r)
   : compose(test(r), path(split('.', k)))
 
