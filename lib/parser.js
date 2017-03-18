const fs           = promisify('fs')
const {sep, dirname } = require('path')
const yaml         = require('js-yaml')
const readdirrsync = require('readdirrsync')
const PH = require('../lib/placeholders')
const steps = require('./steps')

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

const parse = ({name, placeholders }) => {
  let config = PH.merge(placeholders)(getParserConfig(name, getConfig(name)))

  config = deepmap(PH.apply(config.placeholders))(config)
  steps.config = config

  debug('fparser:config')(config)
  if (ARGV.placeholders) return Promise.resolve([config.placeholders])

  return steps.run(config)([null])
}

module.exports = {parse }
