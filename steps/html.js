
const chrome = require('./chrome')

module.exports = options =>
  flatMap(e => {
    if (global.ARGV.chrome) chrome()([e.toString()])

    return require('simply-beautiful').html(e.toString())
  })
