x2c = require('xpath-to-css')

module.exports = () => compose(map(el => x2c(el.path())), flatten)
