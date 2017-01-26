const fs           = promisify('fs')
const {sep, dirname} = require('path')
const yaml         = require('js-yaml')
const readdirrsync = require('readdirrsync')

const readFile = name => fs.readFileSync(name, 'utf8')

const readYaml = compose(
  yaml.safeLoad,
  readFile
)

const removeExtension = replace(/\.[^.]+$/, '')
const splitDir = split(sep)

const splitPath = compose(splitDir, removeExtension)
const requirePath = map(f => assocPath(splitPath(f), readYaml(f), {}))

const getConfig = compose(
  deepmerge.all,
  requirePath,
  concat(['parsers/default.yaml']),
  readdirrsync,
  dirname
)

const getParserConfig = (name, config) => {
  paths = ['parsers/default', name.replace(/\w+.\w+$/, 'default'), name]
  getConfigPath = compose(defaultTo({}), path(__, config), splitPath)
  return deepmerge.all(map(getConfigPath, paths))
}

const parse = ({name, placeholders}) => {
  const steps = require('./steps')
  mergePlaceholders = evolve({placeholders: merge(__, placeholders)})
  config = mergePlaceholders(getParserConfig(name, getConfig(name)))
  
  times(
    () => mapObjIndexed((v,k) =>
      config.placeholders = map(replace(k, String(v)), config.placeholders)
    ,config.placeholders)
  , 10)
  
  _replace = mapObjIndexed((v,k) => unless(x => is(Number,x) || is(Boolean,x), replace(k,v)))
  replacer = compose(...values(_replace(config.placeholders)))
  
  config = deepmap(replacer, config)
  steps.config = config
  if (ARGV.verbose) debug('fparser:config')(config)
  if (ARGV.placeholders)
    return Promise.resolve([config.placeholders])
  return steps.run(config)(null)
}
  
module.exports  = {parse}
