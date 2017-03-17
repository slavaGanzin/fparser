const PH = require('../lib/placeholders')

module.exports = command => flatMap(placeholders => {
  return new Promise((resolve, reject) =>
    require('child_process').exec(
      PH.apply(placeholders)(command),
      (error, stdout, stderr) =>
        error
          ? reject({error, stdout, stderr})
          : resolve(stdout.replace(/\n$/m, ''))
      ))
})
