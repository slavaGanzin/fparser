module.exports = options => flatMap(input => {
  
  if (is(String, input))
      input = mapObjIndexed((v,k) => replace('$1', input, v), options.placeholders)
  
  return require('../lib/parser').parse(deepmerge(options, {
    placeholders: input
  }))
})
