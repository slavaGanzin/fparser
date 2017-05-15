const transform = flip(require('jsonpath-object-transform'))

module.exports = compose(flatMap, transform)
