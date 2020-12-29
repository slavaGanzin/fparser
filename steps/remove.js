const c2x = unless(test(/^\/\//), require('css-to-xpath'))

const getSelectors = x =>
  ` ${x.attr('id') ? `#${x.attr('id').value()} ` : ''}${x.attr('class') ? replace(/\s+/, ' ', replace(/\s(\w+)/gim, '.$1', ` ${x.attr('class').value()}`)) : ''} `

const traverse = xmldoc => regexes => {
  if (isEmpty(regexes)) return

  const r = new RegExp(join('|', map(replace(/^\/|\/$/gim, ''), regexes)), 'gim')

  return map(x => {
    if (!r.test(getSelectors(x))) return
    if (global.verbosity > 0) pp({[`remove /${getSelectors(x).match(r)}/`]: x.toString()})
    x.remove()
  }, xmldoc.find(c2x('*')))
}

const mapOverSelectors = xmldoc => map(selector => map(x => {
  if (global.verbosity > 0) pp({[`remove ${selector}`]: x.toString()})
  x.remove()
}, xmldoc.find(c2x(selector))))

module.exports = selectors => flatMap(
  tap(xmldoc => evolve({
    0: mapOverSelectors(xmldoc),
    1: traverse(xmldoc),
  }, reverse(partition(x => x.startsWith('/'), coerceArray(selectors)))))
)
