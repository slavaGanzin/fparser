const connect = identity
const fs = promisify('fs')
const mkdirp = require('mkdirp')
const {sep, basename, dirname} = require('path')

const dir = (key, id) =>
  key + sep + dirname(id).replace(/.*\/\//, '')
const file = basename
const full = (key, id) => dir(key, id) + sep + file(id)

const save = ({data, pre, key, id}) => {
  mkdirp.sync(dir(key, id))
  return new Promise((r, rej) =>
    fs.writeFile(full(key, id), pre(data))
      .then(always(r(data)))
      .catch(rej)
)
}

const get = ({key, id, post}) =>
  new Promise(r =>
    fs.readFile(full(key, id), 'utf8')
    .then(post)
    .then(r)
  )


const has = ({key, id}) =>
  new Promise(r => fs.stat(full(key, id))
    .then(() => r(true))
    .catch(() => r(false)))

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
