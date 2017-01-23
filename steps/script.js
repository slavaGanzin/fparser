module.exports = command => flatMap( obj =>
  new Promise((resolve, reject) =>
    require('child_process').exec(command,
      (error, stdout, stderr) =>
        error
          ? reject({error, stdout, stderr})
          : resolve(stdout.replace(/\n$/m, ''))
      )))
