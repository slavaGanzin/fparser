const url = require('url')

module.exports = options => flatMap(_url => url.parse(_url, false, true)[options])
