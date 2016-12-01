module.exports = attr => flatMap(el => {
  if (el.attr(attr)) return el.attr(attr).value()
})
