let redis = null

const connect = unless(() => redis, tap(options => {
  redis = new require('ioredis')(options)
}))

const save = ({key, id, data}) =>
  redis.hset(key, id, data).then(() => `${key}/${id}`)

const get = ({key, id}) =>
  new Promise(r => redis.hget(key, id).then(r))

const has = ({key, id}) =>
  new Promise(r => redis.hget(key, id).then(r)).then(Boolean)

const skip = arg =>
  has(arg).then(_has => _has ? Promise.resolve(_has) : save(arg))

module.exports = {
  actions: {
    save,
    get,
    has,
    skip,
  },
  connect,
}

global.finishHandlers.push(() => redis.quit())
