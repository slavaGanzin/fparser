const { expect } = require('chai')

module.exports = expectations => flatMap(data =>
  mapObjIndexed((v, f) => expect(data)[f](v), expectations) && data)
