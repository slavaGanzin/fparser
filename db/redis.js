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

const has = composeP(Boolean, get)

const skip = ({key, id}) =>
  has({key, id})
    ? null
    : save({key, id, data: true}) && id

const all = ({key}) =>
  redis.hgetall(key).then(parseIfJSON)

module.exports = {
  actions: {
    save,
    get,
    has,
    skip,
    all,
  },
  connect,
}
