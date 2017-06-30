const R = require('ramda')
const path = require('path')
const concatWithPrevious = (a, e) => R.concat(a, [`${R.last(a)},${e}`])
const VERBOSITY_LEVELS = R.reduce(
  concatWithPrevious,
  ['error*,:*'],
  [
    'get*,post*,put*,update*,db:*',
    'debug*',
    'fparser*',
    '*',
  ])

const verbosity = R.clamp(0, VERBOSITY_LEVELS.length - 1,
  R.reject(R.isEmpty, R.map(R.match(/-v+/g), process.argv)
).toString().length - 1)

// setTimeout(() => console.log(process._getActiveHandles()), 100)

process.env.DEBUG = `${VERBOSITY_LEVELS[verbosity]},${process.env.DEBUG || ''}`
const debug = R.compose(R.tap, R.memoize(require('debug')))

const cutDirname = R.replace(
  path.resolve(__dirname.replace(/lib$/, '')), '')

const ERROR_LINE = 8
const logFile = msg => R.tap(x => debug(`debug:${msg}`)(
  `${cutDirname(new Error().stack.split('\n')[ERROR_LINE])} ${msg}`, x)
)

const D = f => R.compose(logFile('out'), f, logFile('in'))

module.exports = {D, debug}
