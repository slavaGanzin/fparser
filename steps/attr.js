module.exports = attr => compose(reject(either(isNil, isEmpty)), flatMap(el =>
   el.attr(attr) && el.attr(attr).value()
))
