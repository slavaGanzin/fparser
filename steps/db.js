preprocessor = require('../db/preprocessor')

dispatch = (options, actions) => data =>
  actions[options.action](merge(options, {
    data: preprocessor(options, data),
    id: data[options.id]
  }))
  .then(() => data)

module.exports = options => {
  provider = require('../db/'+options.provider)
  return flatMap(compose(dispatch(options, provider.actions), provider.connect))
}
