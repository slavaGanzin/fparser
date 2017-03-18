const toJson = flip(require('xml2json').toJson)

module.exports = options => map(toJson(options))
