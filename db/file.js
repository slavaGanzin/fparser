const connect = identity
const fs = thenify('fs')
const mkdirp = thenify('mkdirp')
const {sep, basename, dirname, join} = require('path')

const dir = (key, id) =>
  key + sep + dirname(id).replace(/.*\/\//, '')

const full = (key, id) => join(dir(key, id), basename(id))

const save = ({data, key, id}) =>
  mkdirp(dir(key, id))
  .then(() =>
    fs.writeFile(full(key, id), data))
  .then(always(full(key, id)))

const get = ({key, id}) =>
  fs.readFile(full(key, id), 'utf8')

const has = ({key, id}) =>
  fs.stat(full(key, id))
    .then(always(true))
    .catch(() => Promise.resolve(false))

const all = ({key}) =>
  fs.readdir(key)
    .then(map(f => fs.readFile(join(key, f), 'utf8')))
    .then(x => Promise.all(x))

const skip = arg =>
  has(arg).then(_has => _has ? Promise.resolve(_has) : save(arg))

module.exports = {
  actions: {
    get,
    save,
    has,
    skip,
    all,
  },
  connect,
}
