const {run} = require('../lib/steps')
const fs = thenify('fs')

const F = require('path').resolve('memoized')

fs.mkdir(F)
  .then(identity)
  .catch(identity)

const md5 = value =>
  require('crypto')
    .createHash('MD5')
    .update(value, 'utf8')
    .digest()

const unlessMemoized = (steps, run) => input => {
  const k = md5(join('', flatten(toPairs(steps))) + input)
  const p = `${F}/${k}`

  return fs.stat(p)
    .then(() => fs.readFile(p))
    .catch(() => run(steps)(input).then(JSON.stringify).then(json => fs.writeFile(p, json)))
}

module.exports = steps => flatMap(unlessMemoized(steps, run))
