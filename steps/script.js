const {exec} = require('child_process')
const PH = require('../lib/placeholders')


module.exports = command => flatMap(placeholders => new Promise((resolve, reject) =>
  exec(
    PH.apply(PH.pipeline({}, placeholders).placeholders)(command),
    (error, stdout, stderr) =>
      error
        ? reject({error,
          stdout,
          stderr})
        : resolve(stdout.replace(/\n$/m, '')),
  )))
