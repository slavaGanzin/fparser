fs           = promisify('fs')
const {sep, dirname} = require('path')
yaml         = require('js-yaml')
readdirrsync = require('readdirrsync')
deepmerge = require('deepmerge')
deepmap = flip(require('deep-map'))

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

parseStep = compose(
  step => require(`../steps/${head(keys(step))}.js`)(...values(step)),
  when(is(String), assoc(__, '', {}))
)

parse = ({ARGV, name, placeholders}) => {
  mergePlaceholders = evolve({placeholders: merge(__, placeholders)})
  config = mergePlaceholders(getParserConfig(name, getConfig(name)))
  
  times(
    () => mapObjIndexed((v,k) =>
      config.placeholders = map(replace(k, v), config.placeholders)
    , config.placeholders)
  , 10)
  
  replacer = compose(...values(mapObjIndexed((v,k) => replace(k,v), config.placeholders)))
  config = deepmap(replacer, config)
  steps = reverse(map(parseStep, config.steps))
  
  if (ARGV.verbose > 0)
    steps = map(step => compose(step, tap(debug('debug'))), steps)
  return composeP(...steps)('start')
}
  
module.exports  = {parse}
