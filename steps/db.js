const {pre, post} = require('../db/hooks')
const PH = require('../lib/placeholders')

const dispatch = (options, actions) => data => {
  const params = evolve({
    pre,
    post,
    key: PH.apply(data),
    id:  PH.apply(data),
  },
   merge(options, {data})
  )

  debug(`db:${options.action}`)(`${params.key}/${params.id}`)

  return actions[options.action](params)
}

module.exports = options => {
  const provider = dynamicRequire(`../db/${options.provider}`)

  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
}
