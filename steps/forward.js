module.exports = options => flatMap(input =>
  require('../lib/parser').parse(deepmerge(options, {placeholders: input}))
)
