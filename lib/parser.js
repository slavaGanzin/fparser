fs           = promisify('fs')
path         = require('path')
yaml         = require('js-yaml')
readdirrsync = require('readdirrsync')

parserPath      = '../parsers/'

readFile = name => fs.readFileSync(name, 'utf8')
readYaml        = compose(
  yaml.safeLoad,
  readFile
)

removeExtension = replace(/\.[^.]+$/, '')
removePath      = replace(parserPath, '')
splitDir        = split(path.sep)
splitPath       = compose(splitDir, removeExtension, removePath)
requirePath     = map(f => assocPath(splitPath(f), readYaml(f), {}))
mergeRecursive  = reduce(mergeWith(merge), {})

config       = compose(
  mergeRecursive,
  requirePath,
  readdirrsync
)(parserPath)

deepMap = curry((f, o) =>
  mapObjIndexed((x, i) => {
    if(is(RegExp, x))
      return x
    else if (! is(Object, x))
      return f(x, i)
    else if(isArrayLike(x))
      return values(deepMap(f, x))
    return deepMap(f, x)
  }), o)




module.exports  = {parse}
