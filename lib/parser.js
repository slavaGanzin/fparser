fs = promisify('fs')

readParser = name =>
  fs
  .readFile(name, 'utf8')
  .catch(x=> {
    throw new Error(`No file ${name}`)
  })
  
parse = (name, placeholders) =>
  composeP(
    readParser,
    name => `../parsers/${name}.yaml`,
    replace(/\./g, '/')
  )(name)

module.exports = {parse}
