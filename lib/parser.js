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
splitDir = split(sep)

splitPath = compose(splitDir, removeExtension)
requirePath = map(f => assocPath(splitPath(f), readYaml(f), {}))

getConfig = compose(
  deepmerge.all,
  requirePath,
  concat(['parsers/default.yaml']),
  readdirrsync,
  dirname
)

getParserConfig = (name, config) => {
  paths = ['parsers/default', name.replace(/\w+.\w+$/, 'default'), name]
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
  
  _replace = mapObjIndexed((v,k) => unless(x => is(Number,x) || is(Boolean,x), replace(k,v)))
  replacer = compose(...values(_replace(config.placeholders)))
  
  config = deepmap(replacer, config)
  steps.config = config
  return steps.run(config)(null)
}
  
module.exports  = {parse}
