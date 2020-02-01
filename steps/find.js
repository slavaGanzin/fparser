module.exports = selectors => flatMap($ =>
  reduce((a, selector) => a || $(selector), null, coerceArray(selectors))
)
