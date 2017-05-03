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

const skip = ifElse(has, always(null), save)

const all = ({key}) => prop(key, storage)

module.exports = {
  actions: {
    save,
    get,
    has,
    skip,
    all,
  },
  connect,
}
