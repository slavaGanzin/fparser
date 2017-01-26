const fs = promisify('fs')
const mkdirp = require('mkdirp')
const {sep} = require('path')

const save = ({data, _data, key, id}) => {
  mkdirp(key)
  return new Promise(r => fs.writeFile(
    key + sep + data[id],
    _data
  ).then(() =>r(data)))
}

const get = ({key, id}) =>
  new Promise(r =>
    fs.readFile(key + sep + id, 'utf8').then(r)
  ).then(JSON.parse)

            
connect = identity

module.exports =  {
  actions:{
    get,
    save
  },
  connect
}
