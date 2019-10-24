module.exports = message =>
  flatMap(tap(debug(`:${defaultTo('debug', message)}`)))
