x2c = require('xpath-to-css')

module.exports = () => el =>
  x2c(el.path())
