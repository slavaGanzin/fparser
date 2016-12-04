module.exports = options =>
  flatMap(require('../db/'+options.name)(options))
