module.exports = selector => flatMap(xmldoc =>
  xmldoc.find(c2x(selector))
)
