module.exports = selector => flatMap(xmldoc =>
  xmldoc.find(require('css-to-xpath')(selector))
)
