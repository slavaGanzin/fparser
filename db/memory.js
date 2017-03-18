let storage = []

const connect = identity

const save = ({key, id, data, pre }) => {
  storage = assocPath([key, id], pre(data), storage)
  return Promise.resolve(data)
}

const get = ({key, id, post }) =>
  Promise.resolve(post(path([key, id], storage)))

const has = ({key, id }) =>
  Promise.resolve(Boolean(path([key, id], storage)))

const skip = arg =>
  has(arg).then(_has => _has ? Promise.resolve(_has) : save(arg))

module.exports = {
  actions: {
    save,
    get,
    has,
    skip
  },
  connect
}
