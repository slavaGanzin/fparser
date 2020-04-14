module.exports = attrs => flatMap(el => reduce((a, attr) => {
  if (a) return a
  if (el.attr(attr)) return el.attr(attr).value()
}, null, coerceArray(attrs)))
