let redis = null

const connect = unless(() => redis, tap(options => redis = new require('ioredis')(options)))

const save = ({key, id, _data, data}) =>
  new Promise(r => redis.hset(key, id, _data).then(() => r(data)))
  
const get = ({key, id}) =>
  new Promise(r => redis.hget(key, id).then(r)).then(JSON.parse)
  
const has = ({key, id}) =>
  new Promise(r => redis.hget(key, id).then(r)).then(Boolean)
  
const reject = ({key, id, data}) =>
  has({key, id}).then(has => has ? null : data)

module.exports = {
  actions: {
    save, get, has, reject
  },
  connect
}

global.finishHandlers.push(() => redis.quit())
