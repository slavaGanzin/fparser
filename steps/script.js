cp = require('child_process')

module.exports = options => flatMap( obj =>
  new Promise((resolve, reject) =>
    cp.exec(options.command, options.options,
      (error, stdout, stderr) => {
        if (error) return reject({error, stdout, stderr})
        resolve(split('\n',stdout.replace(/\n$/, '')))
      })))
