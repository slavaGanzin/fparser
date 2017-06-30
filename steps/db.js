const PH = require('../lib/placeholders')
const hooks = require('../lib/hooks')
const hash = require('crypto-random-string')

const dispatch = (options, actions) => data =>
  options.pre(data)
    .then(head)
    .then(preData =>
      actions[options.action](evolve({
        key: PH.apply(data),
        id:  compose(replace('$randomHash', hash(40)), PH.apply(data)),
      }, merge(options, {data: preData})))
    )
    .then(options.post)
    .then(head)
    .then(when(() => options.return != 'key', always(data)))

module.exports = hooks(options => {
  const provider = dynamicRequire(`../db/${options.provider}`)

  provider.connect(options)
  return flatMap(dispatch(options, provider.actions))
})
