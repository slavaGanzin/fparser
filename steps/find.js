const c2x = unless(test(/^\/\//), require('css-to-xpath'))


// module.exports = selectors => flatMap($ =>
//   reduce((a, selector) => {
//     if (a) return a
//     if ($(selector).length) return $(selector)
//   }, null, coerceArray(selectors))
// )

module.exports = selector => flatMap(xmldoc =>
  xmldoc.find(c2x(join(', ', coerceArray(selector))))
)
