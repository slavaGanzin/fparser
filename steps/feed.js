const ff = thenify('fast-feed')

module.exports = options => flatMap(ff.parse)
