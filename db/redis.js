Redis = require('ioredis')
redis = null

connect = unless(() => redis, tap(options => redis = new Redis(options)))

actions = {
  save: ({key, id, data}) =>
    redis.hset(key, data[id], JSON.stringify(data))
}

dispatch = options => data =>
  actions[options.action](merge(options, {data}))
    .catch(debug('fparser:redis'))


module.exports = compose(
  dispatch,
  connect
)
