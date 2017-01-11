module.exports = attr => flatMap(el =>
  defaultTo('', el.attr(attr) && el.attr(attr).value())
)
