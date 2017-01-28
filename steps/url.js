const url = require('url')
const addSlashes = unless(test(/\/\//g), x=>'http://'+x)

module.exports = options =>
  flatMap(compose(path([options]), url.parse, addSlashes))
