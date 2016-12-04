Redis = require('ioredis')
redis = null
preprocessor = require('../db/preprocessor')

connect = unless(() => redis, tap(options => redis = new Redis(options)))
actions = {
  save: ({key, id, data}) =>
    redis.hset(key, id, data)
}

dispatch = options => data =>
  actions[options.action](merge(options, {data:
    preprocessor(options, data)
  }))
    .catch(debug('fparser:redis'))


module.exports = compose(
  dispatch,
  connect
)
