redis = null

connect = unless(() => redis, tap(options => redis = new require('ioredis')(options)))
actions = {
  save: ({key, id, _data, data}) =>
    new Promise(r => redis.hset(key, id, _data).then(() => r(data))),
  get: ({key, id}) =>
    new Promise(r => redis.hget(key, id).then(r)).then(JSON.parse)
}

module.exports = {
  actions,
  connect
}

global.finishHandlers.push(() => redis.quit())
