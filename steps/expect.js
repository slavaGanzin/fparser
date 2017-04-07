const {expect} = require('chai')
const chalk = require('chalk')

module.exports = expectations => data =>
  mapObjIndexed((v, f) => {
    try {
      expect(data)[f](v)
    } catch (e) {
      throw `Expect:
${chalk.green(JSON.pretty(e.expected))}
${chalk.red(JSON.pretty(e.actual))}`
    }
  }, expectations) && data
