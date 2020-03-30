//TODO: https://github.com/wanasit/chrono
const appendURL = when(anyPass(map(x => test(RegExp(`${x}$`)), ['audio', 'video', 'image'])), x => `${x}:url`)
const putInArray = anyPass(map(x => test(RegExp(x)), ['audio', 'video', 'image']))
const url = require('url')

const scrapeMeta = metascraper([
  metascraperAudio(),
  metascraperAuthor(),
  metascraperDate(),
  metascraperDescription(),
  metascraperImage(),
  metascraperLogo(),
  metascraperLogoFavicon(),
  //  require('metascraperMediaProvider')(),
  metascraperPublisher(),
  metascraperTitle(),
  metascraperUrl(),
  metascraperVideo(),
  metascraperLang(),
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


  const dates = concat(
    $('time').map((i, x) => chronoNode.parseDate($(x).text(), new Date(''), {forwardDate: true}))
      .get(),

    $('*').map((i, x) => {
      if ($(x).children().length) return

      const d = moment(chronoNode.parseDate($(x).text(), new Date(''), {forwardDate: true}))

      if (d.isValid() && d.isBefore(moment()) && d.isAfter(moment('1991-01-01')))
        return d.toDate()
    })
      .get()
  )


  const d = $('time.published').attr('datetime')

  if (d) meta['time:published'] = new Date(d)

  const m = merge(doc, meta)

  m['html:title'] = $('title').text()

  m['?:host'] = url.parse(oneOf(['url', 'link:alternate', 'link:stylesheet'], m)).hostname
  if (head(dates)) m['?:published'] = head(dates)

  m.pubdate = oneOf(['article:published_time', 'sailthru.date', 'time:published', '?:published', 'date'], m)
  m.title = oneOf(['og:title', 'twitter:title', 'html:title'], m)
  m.publisher = defaultTo('', oneOf(['og:site_name', 'publisher', 'application-name', '?:host'], m))
    .replace(/,.*/, '')
    .replace(/www\./, '')
    .replace(/https?:/, '')
    .replace(/^\/\//, '')


  m.thumbs = reject(x => isEmpty(x) || isNil(x), oneOf(['og:image:url', 'twitter:image:url'], m) || [])

  m.description = m.description || `${$.text()
    .replace(/\s+/gim, ' ')
    .slice(0, 300)}…`
  return m
}))
