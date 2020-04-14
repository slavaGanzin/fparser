const c2x = unless(test(/^\/\//), require('css-to-xpath'))


// module.exports = selectors => flatMap($ =>
//   reduce((a, selector) => {
//     if (a) return a
//     if ($(selector).length) return $(selector)
//   }, null, coerceArray(selectors))
// )

// module.exports = selector => flatMap(xmldoc =>
//   xmldoc.find(c2x(join(', ', coerceArray(selector))))
// )

module.exports = selectors => flatMap(xmldoc => {
  const arr = coerceArray(selectors);
  let result = xmldoc

  for (let i = 0; i < arr.length; i++) {
    const e = xmldoc.find(c2x(arr[i]))
    if (e.length) {
      result = e
      break
    }
  }
  return result;
})