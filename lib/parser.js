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
  const paths = ['parsers/default', name.replace(/\w+.\w+$/, 'default'), name]
  const getConfigPath = compose(defaultTo({}), path(__, config), splitPath)
  return deepmerge.all(map(getConfigPath, paths))
}

const parse = ({name, placeholders}) => {
  const steps = require('./steps')
  const mergePlaceholders = evolve({
    placeholders: merge(__, placeholders)
  })
  let config = mergePlaceholders(getParserConfig(name, getConfig(name)))
  
  let _mem
  
  while(equals(_mem , config.placeholders)) {
    _mem = config.placeholders
    debug('fparser:placeholders')(_mem)
    mapObjIndexed((v,k) =>
      config.placeholders = map(replace(k, String(v)), config.placeholders)
    , config.placeholders)
  }
  
  const _replace = (v,k) => unless(either(is(Number), is(Boolean)), replace(k,v))
  const replacer = compose(...values(mapObjIndexed(_replace, config.placeholders)))
  
  config = deepmap(replacer, config)
  steps.config = config
  
  debug('fparser:config')(config)
  if (ARGV.placeholders)
    return Promise.resolve([config.placeholders])
    
  return steps.run(config)([null])
}
  
module.exports  = {parse}
