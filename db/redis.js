let redis = null
const {handlers} = require('../lib/finish')
const parseIfJSON = when(require('is-json'), JSON.parse)

const connect = unless(() => redis, tap(options => {
  redis = new require('ioredis')(options.redis)
  handlers.push(() => redis.quit())
}))

const save = ({key, id, data}) =>
  redis.hset(key, id, when(is(Object), JSON.stringify, data))
    .then(() => `${key}/${id}`)

const get = ({key, id}) =>
  redis.hget(key, id).then(parseIfJSON)

const has = pCompose(Boolean, get)

const skip = ({key, id}) =>
  has({key, id})
    ? null
    : save({key, id, data: true}) && id

const all = ({key}) =>
  redis.hgetall(key).then(map(parseIfJSON))
    .then(values)


const queue = ({key, size}) =>
  redis.hkeys(key)
    .then(take(size))
    .then(_keys => {
      if (isEmpty(_keys)) return []

      return redis.hmget(key, _keys)
        .then(parseIfJSON)
        .then(values =>
          redis.hmset(`${key}:processing`, fromPairs(zip(_keys, values)))
            .then(() => redis.hdel(key, _keys))
            .then(always(values))
        )
    })

const del = ({key, id}) =>
  redis.hdel(key, id)


module.exports = {
  actions: {
    save,
    get,
    has,
    skip,
    all,
    queue,
    del,
  },
  connect,
}
