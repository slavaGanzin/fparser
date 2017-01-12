xml2json = require('xml2json')

module.exports = options => map(data => xml2json.toJson(data, options))
