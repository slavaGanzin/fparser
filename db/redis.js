let redis = null

const connect = unless(() => redis, tap(options => {
  redis = new require('ioredis')(options)
}))

const save = ({key, id, data, pre}) =>
  pre(data)
  .then(_data => redis.hset(key, id, _data))
  .then(always(data))

const get = ({key, id, post}) =>
  new Promise(r => redis.hget(key, id).then(r)).then(post).then(head)

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
