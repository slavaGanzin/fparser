const fs = require('fs')
const cp = require('child_process')
const cheerio = require('cheerio')
const CACHE = require('path').resolve(`${__dirname}/../http_cache/`)
const url = require('url')

module.exports = () => flatMap(html => {
  if (!global.ARGV || global.ARGV.test || global.ARGV.snapshot) return html

  const f = '/tmp/fparser.html'

  const input = JSON.parse(fs.readFileSync(`${CACHE}/${global.CONFIG.placeholders.url.replace(/\//g, '∕')}`))
  const cache = absoluteUrls(global.CONFIG.placeholders.url, cheerio.load(input.body)).html()


  fs.writeFileSync('/tmp/123.html', cache)

  fs.writeFileSync(f, `
  <style>
  body {
    margin: 0;
  }

  aside {
    width: 40%;
    max-height: 100%;
    height: 100%;
    overflow: scroll;
    position: absolute;
  }

  aside:nth-child(2) {
    left: 40%;
  }

  aside:nth-child(3) {
    left: 80%;
    width: 20%;
  }

  </style>
  <body>
  <aside>${cache}</aside>
  <aside>${html}</aside>
  <aside contenteditable></aside>
  <script>
      const [original, parsed, parser] = document.querySelectorAll('aside')
      const sheet = new CSSStyleSheet()
      const parseGenerator = selector => \`
steps:
    - get
    - parallel:
        meta:
          - meta
        html:
          - find: \${selector}
          - html

tests:
  - url: ${global.CONFIG.placeholders.url}
\`

      document.adoptedStyleSheets = [sheet]

      const infiltrateSelectors = acc => {
          const before = document.querySelectorAll(acc.join(' '))

          if (acc.length == 1) return acc[0]

          for (const p of acc.map(x => acc.filter(y => y!=x))) {
            const after = document.querySelectorAll(p.join(' '))
            console.log(p.join(' '))
            if (Array.from(after).filter((x,i) => before[i] != x))
              return infiltrateSelectors(p)
          }


          return acc.join(' ')
      }

      const generateQuerySelector = function(el, acc=[]) {
        if (!el.parentNode || ['BODY', 'HTML'].indexOf(el.tagName) > -1) {
          return infiltrateSelectors(acc)
        }

        acc.unshift(el.id ? '#'+el.id : el.classList[0] ? '.'+el.classList[0] : el.tagName.toLowerCase())

        return generateQuerySelector(el.parentNode, acc)
      }

      function contains(selector, text) {
          var elements = original.querySelectorAll(selector);
          return Array.prototype.filter.call(elements, function(element){
            return -1!==element.textContent.replace(/\\s+/gim,'').indexOf(text.replace(/\\s+/gim,''))
        });
      }

      original.onmouseup = () => {
       const s = window.getSelection().toString()
       if (!s) return
       const elements = contains('*', s)
       const e = elements.reverse()[0]

       console.log(e)
       const selector = generateQuerySelector(e)

       css = 'aside:nth-child(2) '+selector+' {background: green !important}'
       console.log(css)
       sheet.replaceSync(css);
       parser.innerHTML = '<pre>' + parseGenerator(selector) + '</pre>'

      }

  </script>

  </body>
  `)

  // fs.writeFileSync('/tmp/fparser_html.html', html)
  cp.execSync(`chromium ${f}`)
  return html
})
