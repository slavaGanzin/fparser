const url = require('url')
const addSlashes = unless(match(/\/\//), x=>'//'+x)

module.exports = options =>
  flatMap(compose(path([options]), url.parse, addSlashes))
