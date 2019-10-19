const fs = require('fs')
const cp = require('child_process')

module.exports = () => flatMap(html => {
  if (!global.ARGV || global.ARGV.test || global.ARGV.snapshot) return html

  const f = '/tmp/fparser.html'

  fs.writeFileSync(f, `
  <style>
  body {
    margin: 0;
  }

  iframe {
    width: 50%;
    height: 100%;
    float: left;
  }

  aside {
    width: 50%
    float: right;
    max-height: 100%;
    overflow: scroll;
  }

  </style>
  <body>
  <iframe frameborder="0" src='${global.CONFIG.placeholders.url}'></iframe>
  <aside>
    ${html}
  </aside>
  </body>
  `)

  // fs.writeFileSync('/tmp/fparser_html.html', html)
  cp.execSync(`chromium ${f}`)
  return html
})
