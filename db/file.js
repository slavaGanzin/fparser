const connect = identity
const fs = thenify('fs')
const mkdirp = require('mkdirp')
const {sep, basename, dirname, join} = require('path')

const dir = (key, id) =>
  key + sep + dirname(id).replace(/.*\/\//, '')
const file = basename
const full = (key, id) => join(dir(key, id), file(id))

const save = ({data, pre, key, id}) => {
  mkdirp.sync(dir(key, id))
  return fs.writeFile(full(key, id), pre(data))
    .then(always(data))
}

const get = ({key, id, post}) =>
  fs.readFile(full(key, id), 'utf8')
    .then(post)

const has = ({key, id}) =>
  fs.stat(full(key, id))
    .then(always(true))
    .catch(() => Promise.resolve(false))

const skip = arg =>
  has(arg).then(_has => _has ? Promise.resolve(_has) : save(arg))

module.exports = {
  actions: {
    get,
    save,
    has,
    skip,
  },
  connect,
}
