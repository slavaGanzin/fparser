const highlight = require('cli-highlight').highlight

module.exports = options =>
  flatMap(e => highlight(e.toString()))
