fs = promisify('fs')
path = require('path')

checkParser = compose(
  fs.stat,
  join(path.sep),
  concat(['..','parsers']),
  Array.of,
  replace(/\./g, path.sep)
)

parse = (name, placeholders) =>
  checkParser(name)
  .then(_ => console.log(placeholders))





module.exports = {parse}
