parser = require('../lib/parser')
  
module.exports = options => flatMap(input =>
  parser.parse(merge(options, {placeholders: input}))
)
