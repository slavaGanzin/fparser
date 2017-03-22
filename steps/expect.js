const {expect} = require('chai')

const e = compose(expect, tap(console.log))

module.exports = expectations => data =>
  mapObjIndexed((v, f) => e(data)[f](v), expectations) && data
