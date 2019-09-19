// const c2x = unless(test(/^\/\//), require('css-to-xpath'))

module.exports = selector => flatMap($ => $(selector))
