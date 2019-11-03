const cheerio = require('cheerio')
const {tidy} = require('htmltidy2')

module.exports = options => flatMap(e => new Promise(r =>
  tidy(cheerio.load(e, {decodeEntities: false}).html(), options, (e, result) => {
    if (e) console.error(e)
    r(result)
  })
))
