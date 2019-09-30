const fs           = thenify('fs')
const {sep, resolve} = require('path')
const yaml         = require('js-yaml')
const readdirrsync = require('readdirrsync')
const {pipeline} = require('../lib/placeholders')
const steps = require('./steps')
const glob = require('fast-glob')

const DIR = resolve(`${__dirname}/../parsers`)

const readYaml = pCompose(
  yaml.safeLoad,
  name => fs.readFile(name, 'utf8')
)

console.log(DIR)

const removeExtension = replace(/\.[^.]+$/, '')

const splitPath = compose(split(sep), removeExtension)
const requirePath = map(f => readYaml(f).then(assocPath(splitPath(f), __, {})))

const getConfig = path =>
  Promise.all(requirePath([path, `${DIR}/default.yaml`]))
    .then(deepmerge.all)

const getParserConfig = (name = `${DIR}/fallback.yaml`) =>
  getConfig(name).then(config => {
    const paths = [`${DIR}/default`, name.replace(/\w+.\w+$/, 'default'), name]
    const getConfigPath = compose(defaultTo({}), path(__, config), splitPath)

    return deepmerge.all(map(getConfigPath, paths))
  })

const addProtocol = unless(test(/^https?:\/\//), x => `http://${x}`)

const parse = ({name, placeholders}) =>
  memoize(glob)(`${DIR}/**/*.yaml`)
    .then(paths => reduce((a, x) =>
      a ? a : find(test(RegExp(x.replace(/^.\//, ''), 'i')), paths),
    null,
    reverse(sortBy(length, name.split('.')))
    ))
    .then(getParserConfig)
    .then(pipeline(__, merge({url: addProtocol(name)}, placeholders)))
    .then(config =>
      steps.runConfig(config)(null)
    )


module.exports = {parse}
