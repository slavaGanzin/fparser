

module.exports = command => flatMap(placeholders => {
  const _replace = (v,k) => unless(either(is(Number), is(Boolean)), replace('$'+k,v))
  const replacer = placeholders
    ? apply(compose, values(mapObjIndexed(_replace, placeholders)))
    : identity
  
  
  return new Promise((resolve, reject) =>
    require('child_process').exec(replacer(command),
      (error, stdout, stderr) =>
        error
          ? reject({error, stdout, stderr})
          : resolve(stdout.replace(/\n$/m, ''))
      ))
})
