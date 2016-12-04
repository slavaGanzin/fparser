module.exports = options =>
  flatMap(require('../db/'+options.provider)(options))
