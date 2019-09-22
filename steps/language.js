const cld = thenify('cld')

module.exports = options => flatMap(
  pCompose(
    dotPath('languages.0.code'),
    x => cld.detect(x, options)
  )
)
