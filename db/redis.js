let redis = null

const connect = unless(() => redis, tap(options => {
  redis = new require('ioredis')(options)
}))

const save = ({key, id, data}) =>
  redis.hset(key, id, data)
    .then(() => `${key}/${id}`)

const get = ({key, id}) =>
  redis.hget(key, id)

const has = composeP(Boolean, get)

const skip = arg =>
  has(arg).then(_has => _has ? _has : save(arg))

const getall = ({key}) =>
  redis.hgetall(key)

module.exports = {
  actions: {
    save,
    get,
    has,
    skip,
    getall,
  },
  connect,
}

global.finishHandlers.push(() => redis.quit())
