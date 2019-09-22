const fs = require('fs')
const cp = require('child_process')

module.exports = () => flatMap(html => {
  const f = '/tmp/fparser.html'

  fs.writeFileSync(f, html)
  cp.execSync(`chromium ${f}`)
  return html
})
