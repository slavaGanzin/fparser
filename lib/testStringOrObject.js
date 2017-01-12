module.exports = (r,k) =>
  test(/^\d+$/, k)
   ? test(regex(r))
   : compose(test(regex(r)), path(split('.', k)))
