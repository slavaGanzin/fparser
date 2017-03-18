const {exec} = require('child_process')
const PH = require('../lib/placeholders')

module.exports = command => flatMap(placeholders => new Promise((resolve, reject) =>
    exec(
      PH.apply(placeholders)(command),
      (error, stdout, stderr) =>
        error
          ? reject({error,
            stdout,
            stderr})
          : resolve(stdout.replace(/\n$/m, ''))
      )))
