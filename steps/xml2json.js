module.exports = options => map(data => require('xml2json').toJson(data, options))
