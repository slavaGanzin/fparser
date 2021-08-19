const connect = identity
const fs = thenify('fs')
const mkdirp = thenify('mkdirp')
const needle = thenify('needle')
const {sep, basename, dirname, join} = require('path')

const dir = (key, id) =>
  key + sep + dirname(id).replace(/.*\/\//, '')

const full = (key, id) => join(dir(key, id), basename(id))

const save = ({data, key, id}) =>
  mkdirp(dir(key, id))
    .then(() => fs.writeFile(full(key, id), JSON.stringify(data)))
    .then(always(full(key, id)))

const download = ({data, key, id}) =>
  mkdirp(dir(key, id))
    .then(() => needle.get(data, {output: full(key, id)}))
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
  has(arg).then(_has => _has ? Promise.resolve() : save(arg).then(() => arg.data))


module.exports = {
  actions: {
    get,
    save,
    has,
    skip,
    all,
    download,
  },
  connect,
}
