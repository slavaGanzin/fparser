module.exports = () => flatMap(el => require('xpath-to-css')(el.path()))
