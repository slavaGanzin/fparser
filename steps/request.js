needle = promisify('needle')
libxml = require('libxmljs')

module.exports = (options) => () => {
  // if (ARGV.verbosity > 0)
  debug('request')(`${options.url}`)
  return needle.request(options.method, options.url, options.data, options)
  .then(input => libxml.parseHtml(input.body, {errors: false}))
}
