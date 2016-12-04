module.exports = options =>
  flatMap(require('../db/'+options.provider)(options))

// module.exports = options =>
//   flatMap(
//     converge(compose, [
//       require('../db/'+options.provider),
//       require('../db/preprocessor')
//     ])(options)
//   )
