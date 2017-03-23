const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')
const log = tap(options => debug(`db:${options.action}`)(`${options.key}/${options.id}`))

const dispatch = (options, actions) => data =>
  options.pre(data).then(([preData]) =>
    actions[options.action](log(evolve({
      key: PH.apply(data),
      id:  PH.apply(data),
    }, merge(options, {data: preData}))))
  )
  .then(options.post)
  .then(head)

module.exports = hooks(options => {
  const provider = dynamicRequire(`../db/${options.provider}`)

  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
})
