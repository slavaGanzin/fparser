x2c = require('xpath-to-css')

module.exports = () => flatMap(el => x2c(el.path()))
