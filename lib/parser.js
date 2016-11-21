fs           = promisify('fs')
path         = require('path')
yaml         = require('js-yaml')
readdirrsync = require('readdirrsync')
deepmerge = require('deepmerge')
deepmap = require('deep-map')

readFile = name => fs.readFileSync(name, 'utf8')
readYaml = compose(
  yaml.safeLoad,
  readFile
)

createReplacers = compose(
  apply(compose),
  map(compose(apply(replace), split('='))),
  split(' ')
)

replacer = createReplacers('a=1 b=2')
replacer('a b')


removeExtension = replace(/\.[^.]+$/, '')
splitDir        = split(path.sep)
splitPath       = compose(splitDir, removeExtension)
requirePath     = map(f => assocPath(splitPath(f), readYaml(f), {}))

getConfig       = compose(
  deepmerge.all,
  requirePath,
  readdirrsync,
  path.dirname
)

getParserConfig = (name, config) => {
  _path = split(path.sep, removeExtension(name))
  _default = concat(dropLast(1, _path), ['default'])
  getConfig = compose(defaultTo({}), R.path(__, config))
  return deepmerge.all(map(getConfig, [_path, _default]))
}

parse = ({name, placeholders}) => {
  mergePlacholders = evolve({placeholders: merge(__, placeholders)})
  config = getParserConfig(name, getConfig(name))
  
  times(
    () => mapObjIndexed((v,k) =>
      config.placeholders = map(replace(k, v), config.placeholders)
    , config.placeholders)
  , 10)
  
  replacer = apply(compose)(values(mapObjIndexed((v,k) => replace(k,v), config.placeholders)))
  config = deepmap(config, replacer)
  
  return Promise.resolve(config.steps)
}
  
module.exports  = {parse}
