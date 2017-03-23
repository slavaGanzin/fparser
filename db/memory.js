let storage = []

const connect = identity

const save = ({key, id, data}) => {
  storage = assocPath([key, id], data, storage)
  return `${key}/${id}`
}

const get = ({key, id}) =>
  path([key, id], storage)

const has = ({key, id}) =>
  Boolean(path([key, id], storage))

const skip = arg =>
  has(arg).then(_has => _has ? Promise.resolve(_has) : save(arg))

module.exports = {
  actions: {
    save,
    get,
    has,
    skip,
  },
  connect,
}
