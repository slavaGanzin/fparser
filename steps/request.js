needle = promisify('needle')

module.exports = (options) => () =>
  needle.request(options.method, options.url, options.data, options)
