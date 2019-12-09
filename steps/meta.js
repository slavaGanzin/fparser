//TODO: https://github.com/wanasit/chrono
const appendURL = when(anyPass(map(x => test(RegExp(`${x}$`)), ['audio', 'video', 'image'])), x => `${x}:url`)
const putInArray = anyPass(map(x => test(RegExp(x)), ['audio', 'video', 'image']))
const url = require('url')

const scrapeMeta = require('metascraper')([
  require('metascraper-audio')(),
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  //  require('metascraperMediaProvider')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  require('metascraper-video')(),
  require('metascraper-lang')(),
])

const oneOf = compose(head, reject(isNil), props)

module.exports = options => flatMap($ => scrapeMeta({html: $.html(), url: options.url}).then(doc => {
  const meta = {}

  $('meta').map((i, x) => {
    x = $(x)
    const k = appendURL(x.attr('property') || x.attr('name'))
    const content = x.attr('content')

    if (x.attr('charset'))
      meta.charset = x.attr('charset')

    if (!k) return
    if (putInArray(k)) {
      meta[k] = isArrayLike(meta[k])
        ? append(content, meta[k])
        : [content]
    } else
      meta[k] = content
  })

  $('link').map((i, x) => {
    x = $(x)
    const k = join(':', reject(isNil, ['link', x.attr('rel'), x.attr('hreflang')]))

    meta[k] = x.attr('href')
  })

  const dates = []

  $('*').map((i, x) => {
    if ($(x).children().length) return

    const d = moment.utc(new Date($(x).text()))

    if (d.isValid() && d.isBefore(moment()) && d.isAfter(moment('1991-01-01')))
      dates.push(d)
  })


  const d = $('time.published').attr('datetime')

  if (d) meta['time:published'] = new Date(d)

  const m = merge(doc, meta)

  m['html:title'] = $('title').text()

  m['?:host'] = url.parse(oneOf(['url', 'link:alternate', 'link:stylesheet'], m)).hostname
  if (head(dates)) m['?:published'] = head(dates).toDate()

  m.pubdate = oneOf(['date', 'article:published_time', 'article:modified_time', 'time:published', '?:published'], m)
  m.title = oneOf(['og:title', 'html:title'], m)
  m.publisher = defaultTo('', oneOf(['og:site_name', 'publisher', 'application-name', '?:host'], m)).replace(/,.*/, '')
  m.thumbs = oneOf(['og:image:url', 'twitter:image:url'], m)
  m.description = m.description || `${$.text()
    .replace(/\s+/gim, ' ')
    .slice(0, 300)}…`
  return m
}))
