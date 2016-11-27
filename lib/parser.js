fs           = promisify('fs')
const {sep, dirname} = require('path')
steps = require('./steps')
yaml         = require('js-yaml')
readdirrsync = require('readdirrsync')

readFile = name => fs.readFileSync(name, 'utf8')

readYaml = compose(
  yaml.safeLoad,
  readFile
)

removeExtension = replace(/\.[^.]+$/, '')
splitDir        = split(sep)

splitPath       = compose(splitDir, removeExtension)
requirePath     = map(f => assocPath(splitPath(f), readYaml(f), {}))

getConfig       = compose(
  deepmerge.all,
  requirePath,
  readdirrsync,
  dirname
)

getParserConfig = (name, config) => {
  paths = ['default', name.replace(/\w+.\w+$/, 'default'), name]
  getConfigPath = compose(defaultTo({}), path(__, config), splitPath)
  return deepmerge.all(map(getConfigPath, paths))
}

parse = ({name, placeholders}) => {
  mergePlaceholders = evolve({placeholders: merge(__, placeholders)})
  config = mergePlaceholders(getParserConfig(name, getConfig(name)))
  
  times(
    () => mapObjIndexed((v,k) =>
      config.placeholders = map(replace(k, v), config.placeholders)
    , config.placeholders)
  , 10)
  
  replacer = compose(...values(mapObjIndexed((v,k) => replace(k,v), config.placeholders)))
  config = deepmap(replacer, config)
  
  return steps.run(config.steps)('input')
}
  
module.exports  = {parse}
