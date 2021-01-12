module.exports = options =>
  flatMap(e => {
    if (global.ARGV.chrome) require('./chrome')()([e.toString()])

    return e.toString()
  })
