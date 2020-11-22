require(__dirname+'/global')

const url = require('url')
const attributes = {
  data: ['href', 'src', 'codebase', 'cite', 'background', 'action', 'profile', 'formaction', 'icon', 'manifest', 'archive', 'data-src', 'data-href', 'data-lazy-src', 'src-defer', 'href-defer'],
  lazy: ['data-src', 'data-lazy-src', 'src-defer'],
}

global.absoluteUrls = (URL, $) => {
  const {protocol, host} = url.parse(URL)

  for (const a of attributes.lazy) {
    $(`[${a}]`).map((i, x) => {
      if ($(x).attr(a)[0] == '#') return
      $(x).attr('src', url.resolve(URL, $(x).attr(a)))
    })
  }

  for (const a of attributes.data) {
    $(`[${a}]`).map((i, x) => {
      if ($(x).attr(a)[0] == '#') return
      $(x).attr(a, url.resolve(URL, $(x).attr(a)))
    })
  }

  return $
}


const fs           = thenify('fs')
const {sep, resolve} = require('path')
const yaml         = require('js-yaml')
const {pipeline} = require('../lib/placeholders')
const steps = require('./steps')
const parseUrl = require('url').parse

const DIR = resolve(`${__dirname}/../parsers`)

const readYaml = pCompose(
  yaml.safeLoad,
  name => fs.readFile(name, 'utf8'),
)

const removeExtension = replace(/\.[^.]+$/, '')

const splitPath = compose(split(sep), removeExtension)
const requirePath = map(f => readYaml(f).then(assocPath(splitPath(f), __, {})))

const rules = readYaml(__dirname+'/../rules.yaml')
  .then(x =>
    (name, parsers) => head(juxt(values(mapObjIndexed((r, parser) => ifElse(
      test(RegExp(r)),
      () => DIR+'/'+parser+'.yaml',
      () => null,
    ), x)))(name))
  )

const getConfig = path =>
  Promise.all(requirePath([path, `${DIR}/default.yaml`]))
    .then(deepmerge.all)

const getParserConfig = name =>
  getConfig(name).then(config => {
    const paths = ['parsers/default', `${DIR}/default`, name.replace(/\w+.\w+$/, 'default'), name]
    const getConfigPath = compose(defaultTo({}), path(__, config), splitPath)

    return deepmerge.all(map(getConfigPath, paths))
  })

const addProtocol = unless(test(/^https?:\/\//), x => `http://${x}`)

const getBaseURL = url => parseUrl(url).hostname || parseUrl(url).pathname

const subdomainIterator = compose(
  map(x => test(RegExp(x, 'i'))),
  init,
  map(x => `\/${x}`),
  reject(isEmpty),
  split('%'),
  replace(/(^|\.)([^.]+)/g, (a, b, c, i, host) => replace(/^\./, '', `${slice(i, Infinity, host)}%`)),
  getBaseURL,
)

const parsers = fastGlob([`parsers/*.yaml`, 'parsers/**/*.yaml', `${DIR}/**/*.yaml`])
const parse = ({name, placeholders}) =>
  Promise.all([parsers, rules])
    .then(([paths, rules]) => rules(name) || reduce((a, x) => a || find(x, paths), null, subdomainIterator(name)) || `${DIR}/fallback.yaml`)
    .then(tap(parser => global.PARSER = parser))
    .then(getParserConfig)
    .then(config => {
      const m = compose(
        f => f(null),
        steps.runConfig,
        pipeline(config),
        test(/yaml$/, name) ? identity : merge({url: addProtocol(name)})
      )

      if (global.ARGV && (global.ARGV.test || global.ARGV.snapshot))
        return Promise.all(map(m, config.test))
          .then(flatten)
          .then(require('./test')(name, config))

      return m(placeholders)

    })

module.exports = {parse}
