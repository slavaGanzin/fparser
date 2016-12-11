preprocessor = require('../db/preprocessor')

dispatch = (options, actions) => data =>
  actions[options.action](merge(options, {
    data: preprocessor(options, data),
    id: data[options.id]
  }))
  .then(() => data)

module.exports = options => {
  const {actions,connect} = require('../db/'+options.provider)
  return flatMap(compose(dispatch(options, actions), connect))
}

// module.exports = options =>
//   flatMap(
//     converge(compose, [
//       require('../db/'+options.provider),
//       require('../db/preprocessor')
//     ])(options)
//   )
