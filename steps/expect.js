const { expect } = require('chai')

module.exports = expectations => data =>
  mapObjIndexed((v, f) => expect(data)[f](v), expectations) && data
