needle = promisify('needle')
libxml = require('libxmljs')

module.exports = (options) => () => {
  debug('request')(`${options.url}`)
  console.log(options)
  
  return needle.request(options.method, options.url, options.data, options)
  .then(when(() => ARGV.verbose > 1, tap(debug('html'))))
  // .then(when(() => ARGV.verbose > 1, tap(compose(debug('html'), path('body')))))
  
  .then(input => libxml.parseHtml(input.body, {errors: false}))
}
