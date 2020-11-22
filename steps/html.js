
const chrome = require('./chrome')

module.exports = options =>
  flatMap(e => {
    if (global.ARGV.chrome) chrome()([e.toString()])

    return simplyBeautiful.html(e.toString())
  })
