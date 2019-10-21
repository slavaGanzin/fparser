const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const {diffTrimmedLines, diffArrays} = require('diff')
const chalk = require('chalk')
const yaml         = require('js-yaml')

const cheerioOptions = {ignoreWhitespace: true, normalizeWhitespace: true}

const w = replace(/\n\s*\n/g, '\n')

const textDiff = (a, b) => {
  let hasChanges = false

  const d = join('', diffTrimmedLines(w(a), w(b)).map(({added, removed, value}) => {
    if ((added || removed) && value.trim()) hasChanges = true
    return chalk[added ? 'green' : removed ? 'red' : 'grey'](value)
  }))

  if (hasChanges) return d
}

const comparator = (now, expect) => {
  // before = cheerio.load(before, cheerioOptions)
  now = cheerio.load(now, cheerioOptions)

  let diff = {}

  const text = now.text()

  // diff.cached = textDiff(text, before.text())

  if (expect.text)
    diff.text = textDiff(text, expect.text)


  const attributesSelector = `[${global.attributes.data.join('], [')}]`

  const attr = []

  now(attributesSelector)
    .map((i, x) => attr.push(global.attributes.data.reduce((a, attr) => a || now(x).attr(attr), '')))

  if (expect.attr) {
    let hasChanges = false

    diff.attr = flatten(diffArrays(attr, expect.attr)
      .map(({added, removed, value}) => {
        if (added || removed) hasChanges = true
        return map(chalk[added ? 'green' : removed ? 'red' : 'grey'], value)
      }))

    if (!hasChanges) delete diff.attr
  }


  return {diff, attr, text: w(text)}
}

module.exports = (name, config) => results => {
  // const p = `${DIR}/${name}`

  // const json = JSON.pretty(results)

  // try {
  //   if (ARGV.snapshot) throw 'need to write'
  //   fs.statSync(p)
  // } catch (e) {
  //   fs.writeFileSync(p, json)
  // }
  //
  // const snapshot = JSON.parse(fs.readFileSync(p))

  const expect = {}

  for (const i in results) {
    const {diff, attr, text} = comparator(results[i].html, pathOr({}, [i, 'html'], config.expect))

    expect[i] = {html: {attr, text}}

    if (!isEmpty(diff)) pp({name, placeholders: config.test[i], diff})
    console.log()
  }

  if (ARGV.snapshot) {
    const parser = yaml.load(fs.readFileSync(PARSER, 'utf-8'))

    parser.expect = expect
    fs.writeFileSync(PARSER, yaml.safeDump(parser, {lineWidth: Infinity}).replace(/^(\w)/gm, '\n$1'))
  }


  return ['']
}
