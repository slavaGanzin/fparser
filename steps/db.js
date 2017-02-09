const {pre, post} = require('../db/hooks')
let key,id

const dispatch = (options, actions) => data => {
  id = key = is(Object, data)
  ? compose(...values(mapObjIndexed((v,k) => replace('$'+k, String(v)), data)))
  : identity
  
  return actions[options.action](
    evolve({
      pre, post, key, id
    },
      merge(options, { data })
    )
  )
}

module.exports = options => {
  const provider = require('../db/'+options.provider)
  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
}
