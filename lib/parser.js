const fs           = thenify('fs')
const {sep, resolve} = require('path')
const yaml         = require('js-yaml')
const readdirrsync = require('readdirrsync')
const {pipeline} = require('../lib/placeholders')
const steps = require('./steps')
const glob = require('fast-glob')
const parseUrl = require('url').parse

const DIR = resolve(`${__dirname}/../parsers`)

const readYaml = pCompose(
  yaml.safeLoad,
  name => fs.readFile(name, 'utf8'),
)

const removeExtension = replace(/\.[^.]+$/, '')

const splitPath = compose(split(sep), removeExtension)
const requirePath = map(f => readYaml(f).then(assocPath(splitPath(f), __, {})))

const getConfig = path =>
  Promise.all(requirePath([path, `${DIR}/default.yaml`]))
    .then(deepmerge.all)

const getParserConfig = name =>
  getConfig(name).then(config => {
    const paths = [`${DIR}/default`, name.replace(/\w+.\w+$/, 'default'), name]
    const getConfigPath = compose(defaultTo({}), path(__, config), splitPath)

    return deepmerge.all(map(getConfigPath, paths))
  })

const addProtocol = unless(test(/^https?:\/\//), x => `http://${x}`)

const getBaseURL = url => parseUrl(url).hostname || parseUrl(url).pathname

const subdomainIterator = compose(
  map(x => test(RegExp(x, 'i'))),
  append('/fallback.yaml'),
  init,
  map(x => `\/${x}`),
  reject(isEmpty),
  split('%'),
  replace(/(^|\.)([^.]+)/g, (a, b, c, i, host) => replace(/^\./, '', `${slice(i, Infinity, host)}%`)),
  getBaseURL,
)

const parse = ({name, placeholders}) =>
  memoize(glob)(`${DIR}/**/*.yaml`)
    .then(paths => reduce((a, x) => a || find(x, paths), null, subdomainIterator(name)))
    .then(parser => global.PARSER = parser)
    .then(debug('fparser:parser'))
    .then(getParserConfig)
    .then(config => {
      const m = compose(
        f => f(null),
        steps.runConfig,
        pipeline(config),
        merge({url: addProtocol(name)})
      )

      if (! ARGV.test && ! ARGV.snapshot) return m(placeholders)

      return Promise.all(map(m, config.test))
        .then(flatten)
        .then(require('./test')(name, config))
    })

module.exports = {parse}
