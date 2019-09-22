const cheerio = require('cheerio')

module.exports = () => flatMap(e =>
  cheerio.load(e, {decodeEntities: false}).html())
