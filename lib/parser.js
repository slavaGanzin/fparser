const fs           = thenify('fs')
const {sep, dirname} = require('path')
const yaml         = require('js-yaml')
const readdirrsync = require('readdirrsync')
const PH = require('../lib/placeholders')
const steps = require('./steps')

const readFile = name => fs.readFile(name, 'utf8')

const readYaml = composeP(
  yaml.safeLoad,
  readFile
)

const removeExtension = replace(/\.[^.]+$/, '')

const splitPath = compose(split(sep), removeExtension)
const requirePath = map(f => readYaml(f).then(assocPath(splitPath(f), __, {})))

const getConfig = composeP(
  deepmerge.all,
  memoize(requirePath),
  concat(['parsers/default.yaml']),
  memoize(readdirrsync),
  dirname
)

const getParserConfig = curry((name, config) => {
  const paths = ['parsers/default', name.replace(/\w+.\w+$/, 'default'), name]
  const getConfigPath = compose(defaultTo({}), path(__, config), splitPath)

  return deepmerge.all(map(getConfigPath, paths))
})

const parse = ({name, placeholders}) =>
  getConfig(name)
    .then(getParserConfig(name))
    .then(PH.merge(placeholders))
    .then(config => deepmap(PH.apply(config.placeholders))(config))
    .then(debug('fparser:config'))
    .then(config =>
    ARGV.placeholders
      ? Promise.resolve([config.placeholders])
      : steps.runConfig(config)(null)
  )

module.exports = {parse}
