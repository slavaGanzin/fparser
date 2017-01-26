module.exports = attr => flatMap(el =>
   el.attr(attr) && el.attr(attr).value()
)
