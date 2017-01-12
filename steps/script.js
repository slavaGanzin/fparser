cp = require('child_process')

module.exports = command => flatMap( obj =>
  new Promise((resolve, reject) =>
    cp.exec(command,
      (error, stdout, stderr) =>
        error
          ? reject({error, stdout, stderr})
          : resolve(stdout)
      )))
