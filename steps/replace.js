parse = compose(
  ([r,s='']) => replace(regex(r), s),
  split(/,?\s+/)
)

module.exports = options =>
  flatMap(apply(compose, map(parse, options)))
