const $ = require('cheerio')

module.exports = () => flatMap(e => $(e).html())
