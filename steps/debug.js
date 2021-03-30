module.exports = message =>
  flatMap(global.verbosity > 0 ? pp : identity)
