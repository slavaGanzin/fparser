const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')

const dispatch = (options, actions) => data =>
  options.pre(data)
    .then(head)
    .then(preData =>
    actions[options.action](evolve({
      key: PH.apply(data),
      id:  PH.apply(data),
    }, merge(options, {data: preData})))
  )
    .then(debug(`db:${options.action}`))
    .then(options.post)
    .then(head)

module.exports = hooks(options => {
  const provider = dynamicRequire(`../db/${options.provider}`)

  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
})
