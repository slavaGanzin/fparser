const elasticsearch = require('elasticsearch')
let client = null

const connect = unless(() => client, tap(options => {
  client = new elasticsearch.Client({
    log: 'trace',
  })
  client.ping()
  setTimeout(() => client.ping(), 1000)
}))

const p = x => x.toLowerCase()

const save = ({key, id, data}) =>
  client.index({
    index: p(key),
    type:  p(key),
    id:    p(id),
    body:  data,
  })
  .then(() => `${key}/${id}`)

const get = ({key, id}) =>
  client.get({
    index: p(key),
    type:  p(key),
    id:    p(id),
  })
    .then(prop('_source'))
    .catch(always(false))

const has = ({key, id}) =>
  client.exists({
    index: p(key),
    type:  p(key),
    id:    p(id),
  })


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
