fs = promisify('fs')
mkdirp = require('mkdirp')
const {sep} = require('path')
preprocessor = require('../db/preprocessor')

module.exports = options => {
  mkdirp(options.key)
  return data =>
    fs.writeFile(
      options.key + sep + data[options.id],
      preprocessor(options, data)
    )
}
