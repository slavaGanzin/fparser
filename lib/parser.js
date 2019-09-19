const fs           = thenify('fs')
const {sep, dirname} = require('path')
const yaml         = require('js-yaml')
const readdirrsync = require('readdirrsync')
const {pipeline} = require('../lib/placeholders')
const steps = require('./steps')
const glob = require('fast-glob')

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
  memoize(glob)('parsers/**/*.yaml')
    .then(find(test(RegExp(name.replace(/^.\//, '')))))
    .then(name =>
      getConfig(name)
        .then(getParserConfig(name))
        .then(pipeline(__, placeholders))
        .then(config =>
          ARGV.placeholders
            ? Promise.resolve([config.placeholders])
            : steps.runConfig(config)(null)
        )
    )


module.exports = {parse}
