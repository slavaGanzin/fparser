Redis = require('ioredis')
redis = null

connect = unless(() => redis, tap(options => redis = new Redis(options)))
actions = {
  save: ({key, id, data}) =>
    new Promise(r => redis.hset(key, id, data).then(x => r(data)))
}

module.exports = {
  actions,
  connect
}

global.finishHandlers.push(() => redis.quit())
