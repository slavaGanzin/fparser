
const chrome = require('./chrome')
const beautify = require('simply-beautiful');

module.exports = options =>
  flatMap(e => {
    if (global.ARGV.chrome) chrome()([e.toString()])

    return beautify.html(e.toString())
  })
