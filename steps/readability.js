const read = thenify("node-readability")

module.exports = options =>
  flatMap(composeP(([article, meta]) => article.content, read))
