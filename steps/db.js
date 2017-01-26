const preprocessor = require('../db/preprocessor')

const getId = (data, id) =>
  when(isNil, () => {
    throw `empty key ${id} in ${JSON.pretty(data)}`
  }, data[id])


const dispatch = (options, actions) => data =>
  actions[options.action](merge(options, {
    data,
    _data: preprocessor(options, data),
    key: options.keyPrefix +
      (options.key != '' ? getId(data, options.key) : ''),
    id: options.idPrefix + getId(data, options.id)
  }))

module.exports = options => {
  const provider = require('../db/'+options.provider)
  provider.connect(omit(['keyPrefix'], options))
  return flatMap(dispatch(options, provider.actions))
}
