const {pre, post} = require('../db/hooks')
const PH = require('../lib/placeholders')

const dispatch = (options, actions) => data =>
  actions[options.action](
    evolve({
      pre,
      post,
      key: PH.apply(data),
      id:  PH.apply(data),
    },
      merge(options, {data})
    )
  )

module.exports = options => {
  const provider = dynamicRequire(`../db/${options.provider}`)

  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
}
