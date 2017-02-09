const connect = identity
const fs = promisify('fs')
const mkdirp = require('mkdirp')
const {sep} = require('path')

const save = ({data, pre, key, id}) => {
  mkdirp(key)
  return new Promise(r => fs.writeFile(
    key + sep + data[id],
    pre(data)
  ).then(always(r(data))))
}

const get = ({key, id, post}) =>
  new Promise(r =>
    fs.readFile(key + sep + id, 'utf8').then(r)
  ).then(post)

            
const has = ({key, id}) =>
  new Promise(r => fs.stat(key + sep + id)
    .then(() => r(true))
    .catch(() => r(false)))

const skip = (arg) =>
  has(arg).then(has => has ? Promise.resolve(has) : save(arg))

module.exports =  {
  actions:{
    get, save, has, skip
  },
  connect
}
