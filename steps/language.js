const cld = thenify('cld')

module.exports = options => flatMap(
  composeP(
    dotPath('languages.0.code'),
    x => cld.detect(x, options)
  )
)
