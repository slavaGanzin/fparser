let redis = null

const connect = unless(() => redis, tap(options => redis = new require('ioredis')(options)))

const save = ({key, id, _data, data}) =>
  new Promise(r => redis.hset(key, id, _data).then(() => r(data)))
  
const get = ({key, id}) =>
  new Promise(r => redis.hget(key, id).then(r)).then(JSON.parse)
  
const has = ({key, id}) =>
  new Promise(r => redis.hget(key, id).then(r)).then(Boolean)
  
const skip = (arg) =>
  has(arg).then(has => has ? Promise.resolve(has) : save(arg))

// const delete = ({key, id}) =>
//   new Promise(r => redis.hdel(key, id).then(r))
  
module.exports = {
  actions: {
    save, get, has, skip//, hasnt: composeP(not, has)
  },
  connect
}

global.finishHandlers.push(() => redis.quit())
