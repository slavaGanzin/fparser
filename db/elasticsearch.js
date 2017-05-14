const elasticsearch = require('elasticsearch')
let client = null

const connect = unless(() => client, tap(options =>
  client = new elasticsearch.Client(options)
))

const save = ({key, id, data}) =>
  client.index({
    index: key.toLowerCase(),
    type:  key.toLowerCase(),
    id:    id.toLowerCase(),
    body:  data,
  })
  .then(() => `${key}/${id}`)

const get = ({key, id}) =>
  client.get({
    index: key.toLowerCase(),
    type:  key.toLowerCase(),
    id:    id.toLowerCase(),
  })
  .then(prop('_source'))
  .catch(always(false))

const has = composeP(Boolean, get)

const skip = arg =>
  has(arg).then(_has => _has ? _has : save(arg))

const all = ({key}) =>
  client.search({index: key.toLowerCase()})
  .then(compose(pluck('_source'), path(['hits', 'hits'])))

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
