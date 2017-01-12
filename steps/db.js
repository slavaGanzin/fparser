preprocessor = require('../db/preprocessor')

getId = (data, id) =>
  when(isNil, () => { throw `empty key ${id} in ${JSON.pretty(data)}` }, data[id])

dispatch = (options, actions) => data =>
  actions[options.action](merge(options, {
    data,
    _data: preprocessor(options, data),
    id: getId(data, options.id)
  }))

module.exports = options => {
  provider = require('../db/'+options.provider)
  return flatMap(compose(dispatch(options, provider.actions), provider.connect))
}
