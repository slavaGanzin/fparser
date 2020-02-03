module.exports = selectors => flatMap($ =>
  reduce((a, selector) => {
    if (a) return a
    if ($(selector).length) return $(selector)
  }, null, coerceArray(selectors))
)
