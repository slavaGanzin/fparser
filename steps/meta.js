//TODO: https://github.com/wanasit/chrono
const appendURL = when(anyPass(map(x => test(RegExp(`${x}$`)), ['audio', 'video', 'image'])), x => `${x}:url`)
const putInArray = anyPass(map(x => test(RegExp(x)), ['audio', 'video', 'image']))
const url = require('url')
const c2x = unless(test(/^\/\//), require('css-to-xpath'))

const scrapeMeta = metascraper([
  metascraperTitle(),
  // metascraperDate(),
  metascraperAuthor(),
  metascraperPublisher(),
  metascraperDescription(),
  metascraperImage(),
  metascraperLang(),
  metascraperLogo(),
  metascraperLogoFavicon(),
  //  require('metascraperMediaProvider')(),
  metascraperUrl(),
  metascraperVideo(),
  metascraperAudio(),
])

const first = compose(head, reject(isNil), props)
const firstPath = curry((test, paths, data) => reduce((a,p) => a || test(path(p, data)), null, paths))

const { date, $filter, $jsonld, toRule } = require('@metascraper/helpers')

module.exports = options => flatMap(e => scrapeMeta({
    html: e.toString(), url: options.url
})
.then(unless(x => x.lang, async x =>
    merge(x, {lang: path(['languages', 0, 'code'], await require('cld').detect(e.toString(), {isHTML: true}))})
))
.then(metascrapperMeta => {
  const meta = {}

  const $ = selector => e.find(c2x(selector))

  $('script[type="application/ld+json"]').map(e => {
    if (!e.text) return
    try {
      const jsonld = when(is(Array), indexBy(prop('@type')), when(has('@graph'), prop('@graph'), JSON.parse(e.text())))
      meta['jsonld:pubdate'] = unless(isNil, x => new Date(x).toISOString(), firstPath(x => x!='0000-00-00T00:00:00Z' && tryCatch(Date, () => null)(x), [['Article', 'datePublished'], ['WebPage', 'datePublished'], ['datePublished'], ['dateModified']], jsonld))
      meta['jsonld:title'] = firstPath(x => x, [['Article', 'headline'], ['WebPage', 'title']], jsonld)
    } catch(e) {
      return
    }
  })


  $('meta')
    .map(x => {
      if (x.attr('charset'))
        return meta.charset = x.attr('charset').value()

      const attr = head(reject(isNil, [x.attr('property'), x.attr('name'), x.attr('http-equiv')]))
      if (!attr || !attr.value || !x.attr('content') || !x.attr('content').value) return
      const k = attr.value()

      const content = x.attr('content').value()

      if (!k || !content) return
      if (putInArray(k)) {
        meta[k] = isArrayLike(meta[k])
          ? append(content, meta[k])
          : [content]
      } else
        meta[k] = content
    })

  const dates = $('time').map(x =>
    x.attr('datetime')
      ? x.attr('datetime').value()
      : chronoNode.parseDate(x.text(), new Date(''), {forwardDate: true})
  )


  $('link')
    .map(x => {
      const k = join(':', map(x => x.value(), reject(isNil, [x.attr('rel'), x.attr('hreflang')])))
      if (x.attr('href')) meta[k] = x.attr('href').value()
    })

  const m = merge(metascrapperMeta, meta)

  if (head(dates)) m['?:published'] = head(dates)

  m['html:title'] = $('title').text ? trim($('title').text()) : ''

  m['?:host'] = url.parse(first(['url', 'link:alternate', 'link:stylesheet'], m)).hostname


  if (length(m.publisher) > 100) m.publisher = null

  m.pubdate = first(['jsonld:pubdate', 'article:published_time', 'sailthru.date', 'time:published', '?:published', 'date'], m)

  m.title = trim(first(['jsonld:title', 'og:title', 'twitter:title', 'html:title'], m))

  m.publisher = defaultTo('', first(['og:site_name', 'publisher', 'application-name', '?:host'], m))
    .replace(/,.*/, '')
    .replace(/www\./, '')
    .replace(/https?:/, '')
    .replace(/^\/\//, '')

  m.thumbs = reject(x => isEmpty(x) || isNil(x), first(['og:image:url', 'twitter:image:url'], m) || [])

  const textFromFirstParagraph = e.get(cssToXpath('p,div'))
  m.description = (m.description || `${textFromFirstParagraph ? textFromFirstParagraph.text() : ''}`).replace(/\s+/gim, ' ')

  m.url=decodeURI(m.url)

  return m
}))
