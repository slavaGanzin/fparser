$ = require('cheerio')
module.exports = () => flatMap(e => $(e).text())
