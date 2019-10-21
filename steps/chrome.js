const fs = require('fs')
const cp = require('child_process')
const cheerio = require('cheerio')
const CACHE = require('path').resolve(`${__dirname}/../http_cache/`)
const url = require('url')

module.exports = () => flatMap(html => {
  if (!global.ARGV || global.ARGV.test || global.ARGV.snapshot) return html

  const f = '/tmp/fparser.html'

  const cacheFile = debug('fparser:cache:file')(`${CACHE}/${global.CONFIG.placeholders.url.replace(/\//g, '∕')}`)
  const input = JSON.parse(fs.readFileSync(cacheFile))
  const cache = absoluteUrls(global.CONFIG.placeholders.url, cheerio.load(input.body)).html()


  const attributesSelector = `"[${global.attributes.data.join('],[')}]"`

  fs.writeFileSync('/tmp/123.html', cache)

  fs.writeFileSync(f, `
  <style>
  body {
    margin: 0;
  }

  #original, #parsed, #parser {
    width: 40% !important;
    max-width: 40% !important;
    max-height: 100% !important;
    height: 100% !important;
    overflow: scroll !important;
    position: fixed !important;
  }

  #original {
    z-index: 100000000000000;

  }

  #parsed {
    z-index: 200000000000000;
    left: 40%;
  }

  #parser {
    background: white;
    z-index: 300000000000000;
    left: 80%;
    width: 20% !important;

  }

  #parser pre {
    font-family: Lucida Console !important;
    font-size: 12px !important;
    line-height: 13px !important;
    tab-size: 2 !important;
  }

  </style>
  <body>
  <aside id='original'>${cache}</aside>
  <aside id='parsed'>${html}</aside>
  <aside id='parser' contenteditable></aside>
  <script>
      const original = document.querySelector('#original')
      const parsed = document.querySelector('#parsed')
      const parser = document.querySelector('#parser')
      const parseGenerator = (selector, text, attr) => \`
steps:
    - get
    - parallel:
        meta:
          - meta
        html:
          - find: \${selector}
          - html

test:
  - url: ${global.CONFIG.placeholders.url}

expect:
  -
    html:
      text: |2\${text.replace(/^(\\S)/, '\\n$1').replace(/ +/gi, ' ').replace(/\\n\\s*\\n/g,'\\n').replace(/\\n/g, '\\n\\t\\t\\t\\t\\t\\t')}
      attr:
\${('\\n- '+attr.join('\\n- ')).replace(/\\n/g, '\\n\\t\\t\\t\\t')}
\`

      parser.oninput = () => navigator.clipboard.writeText(parser.textContent)

      const infiltrateSelectors = acc => {
          const before = document.querySelectorAll(acc.join(' '))

          if (acc.length == 1) return acc[0]

          for (const p of acc.map(x => acc.filter(y => y!=x))) {
            const after = original.querySelectorAll(p.join(' '))
            console.log(p.join(' '))
            if (! Array.from(after).filter((x,i) => before[i] != x).length)
              return infiltrateSelectors(p)
          }


          return acc.join(' ')
      }

      function getDataAttributes (el) {
        return Array.from(el.querySelectorAll(${attributesSelector}))
          .map(x => ${JSON.stringify(global.attributes.data)}.reduce((a, attr) => a || x.getAttribute(attr), ''))
      }

      function getHTMLOfSelection () {
        var range;
        if (document.selection && document.selection.createRange) {
          range = document.selection.createRange();
          return range.htmlText;
        }
        else if (window.getSelection) {
          var selection = window.getSelection();
          if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var clonedSelection = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedSelection);
            return div.innerHTML;
          }
          else {
            return '';
          }
        }
        else {
          return '';
        }
      }


      const generateQuerySelector = function(el, acc=[]) {
        if (!el.parentNode || ['BODY', 'HTML'].indexOf(el.tagName) > -1) {
          return infiltrateSelectors(acc)
        }

        acc.unshift(el.id ? '#'+el.id : el.classList[0] ? '.'+el.classList[0] : el.tagName.toLowerCase())

        return generateQuerySelector(el.parentNode, acc)
      }

      let difference = (a,b) => a.filter(x => !b.includes(x))

      function contains(selector, text, attr) {
          var elements = original.querySelectorAll(selector)
          return Array.prototype.filter.call(elements, function(element){
            return -1!==element.textContent.replace(/\\s+/gim,'').indexOf(text.replace(/\\s+/gim,''))
            && difference(attr, getDataAttributes(element)).length == 0
        });
      }

      const unsetOpacity = e => {
        if (!e) return
        if (e.parentNode) unsetOpacity(e.parentNode)
        if (e.style) e.style.opacity = 1
      }

      const setOpacity = selector => {
        Array.from(original.querySelectorAll('*')).map(x=>x.style.opacity = .5)
        Array.from(original.querySelectorAll(selector+', '+selector+' *')).map(x=>x.style.opacity = 1)
        unsetOpacity(original.querySelector(selector))
      }

      setOpacity('body')
      Array.from(original.querySelectorAll('a')).map(x => x.onclick = e => e.preventDefault())

      original.onmouseup = () => {
       const text = window.getSelection().toString()
       const attr = getDataAttributes(new DOMParser().parseFromString(getHTMLOfSelection(), 'text/html'))

       if (!text && !attr.length) return

       const elements = contains('*', text, attr)
       const e = elements.reverse()[0]

       const selector = generateQuerySelector(e)

       setOpacity(selector)

       parsed.innerHTML = e.outerHTML
       parser.innerHTML = '<pre>' + parseGenerator(selector, e.textContent, getDataAttributes(e)) + '</pre>'
       navigator.clipboard.writeText(parser.textContent)
      }

  </script>

  </body>
  `)

  // fs.writeFileSync('/tmp/fparser_html.html', html)
  cp.execSync(`chromium ${f}`)
  return html
})
