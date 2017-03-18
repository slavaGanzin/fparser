const url = require('url')
const addSlashes = unless(match(/\/\//), x => `http://${x}`)

module.exports = options =>
  flatMap(compose(path([options]), url.parse, addSlashes))
