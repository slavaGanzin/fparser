module.exports = message =>
  flatMap(debug(defaultTo('debug', message)))
