const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const DIR = path.resolve(`${__dirname}/../snapshots`)

const cheerioOptions = {ignoreWhitespace: true, normalizeWhitespace: true}
const prepare = [
  html => replace(/ +/g, ' ', cheerio.load(html, cheerioOptions).text()),
  html => cheerio.load(html, cheerioOptions).html())
  identity,
][ARGV.verbose || 0]

const comparator = (before, now) =>
  require('disparity').chars(prepare(before), prepare(now))

module.exports = (name, config) => results => {
  const p = `${DIR}/${name}`

  const json = JSON.pretty(results)

  try {
    if (ARGV.snapshot) throw 'need to write'
    fs.statSync(p)
  } catch (e) {
    fs.writeFileSync(p, json)
  }

  const snapshot = JSON.parse(fs.readFileSync(p))

  for (const i in results) {
    const diff = comparator(snapshot[i].html, results[i].html)

    if (!diff) continue

    pp({name, placeholders: config.test[i], diff})
  }

  return ['']
}
