parse = compose(
  ([r,s]) => replace(require('./regex')(r), s),
  split(/,?\s+/)
)

module.exports = options =>
  flatMap(apply(compose, map(parse, options)))
