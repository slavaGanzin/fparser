const {tidy} = require('htmltidy2')

module.exports = options => flatMap(e => new Promise(r =>
  tidy(e.toString('xhtml'), options, (e, result) => {
    if (e) console.error(e)
    r(trim(result))
  })
))
