const preprocessor = require('../db/preprocessor')

// const getId = (data, id) =>
//   when(isNil, () => {
//     throw `empty key ${id} in ${JSON.pretty(data)}`
//   }, data[id])


const dispatch = (options, actions) => data => {
  const replacer = data
  ? compose(...values(mapObjIndexed((v,k) => replace('$'+k, String(v)), data)))
  : identity
  
  return actions[options.action](merge(options, {
    data,
    _data:  preprocessor(options, data),
    key:    replacer(options.key),
    id:     replacer(options.id)
  }))
}

module.exports = options => {
  const provider = require('../db/'+options.provider)
  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
}
