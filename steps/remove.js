module.exports = selectors => flatMap(e => {
  map(s => e(s).remove(), selectors)
  return e
})
