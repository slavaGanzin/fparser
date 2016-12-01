c2x = D(require('css-to-xpath'))
    
module.exports = selector => flatMap(xmldoc =>
  xmldoc.find(c2x(selector))
)
