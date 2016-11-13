fs = promisify('fs')
path = require('path')
yaml = require('js-yaml')

scanParentDir = compose(
  map(replace('.yaml', '')),
  fs.readdirSync,
  path.dirname
)

readParser = name =>
  fs
  .readFile(name, 'utf8')
  .catch(_ => {
    throw new Error(
`No file ${name}:
Available parsers:
${scanParentDir(name).join('\n')}`
)
  })
  
createReplacer = compose(
  apply(compose),
  map(compose(
    ([x,y]) => replace(RegExp(x, 'g'), y),
    split(/\s*:\s*/)))
  )
  
parse = ({name, placeholders}) =>
  composeP(
    yaml.safeLoad,
    createReplacer(placeholders),
    readParser,
    name => `./parsers/${name}.yaml`,
    replace(/\./g, '/')
  )(name)
  
module.exports = {parse}
