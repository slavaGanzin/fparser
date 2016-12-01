regex = r => new RegExp(split('/', r)[1], split('/', r)[2])
parse = compose(
  ([r,s]) => replace(regex(r), s),
  split(/,?\s+/)
)

module.exports = replacers =>
  flatMap(compose(...map(parse, replacers)))
