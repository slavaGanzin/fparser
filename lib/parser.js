fs = promisify('fs')
path = require('path')
yaml = require('js-yaml')

scanParentDir = compose(map(replace('.yaml', '')), fs.readdirSync, path.dirname)

readParser = name =>
  fs
  .readFile(name, 'utf8')
  .catch(x => {
    throw new Error(
`No file ${name}:
Available parsers:
${scanParentDir(name).join('\n')}`
)
  })
  
parse = (name, placeholders) =>
  composeP(
    yaml.safeLoad,
    readParser,
    name => `./parsers/${name}.yaml`,
    replace(/\./g, '/')
  )(name)

module.exports = {parse}
