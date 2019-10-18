const cheerio = require('cheerio')
const pretty = require('pretty')

module.exports = () => flatMap(e =>
  pretty(cheerio.load(e, {decodeEntities: false}).html())
)
