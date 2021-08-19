const s = require('sanitize-html')

module.exports = options => flatMap(html =>
  s(html, merge(options, {
    exclusiveFilter (frame) {
      return contains(frame.tag, ['div', 'section', 'article']) && !frame.text.trim()
    },
  })),
)
