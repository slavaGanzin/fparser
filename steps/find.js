c2x = require('css-to-xpath')
// p = map(merge(__, {toString: () => this.toString('xhtml')}))
    
module.exports = selector => flatMap(xmldoc =>
  xmldoc.find(c2x(selector))
)
