const {run} = require('../lib/steps')
const limit = require('promise-limit')

module.exports = options => args =>
  limit(options.limit).map(flatten(args), run(options.steps))
