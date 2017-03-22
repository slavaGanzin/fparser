const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')

const dispatch = (options, actions) => data => {
  const params = evolve({
    key:  PH.apply(data),
    id:   PH.apply(data),
    data: composeP(objOf('data'), options.pre),
  },
    merge(options, {data})
  )

  debug(`db:${options.action}`)(`${params.key}/${params.id}`)

  return params.data
    .then(merge(params))
    .then(actions[options.action])
    .then(options.post)
    .then(head)
}

module.exports = hooks(options => {
  const provider = dynamicRequire(`../db/${options.provider}`)

  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
})
