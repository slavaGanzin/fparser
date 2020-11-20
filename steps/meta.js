//TODO: https://github.com/wanasit/chrono
const appendURL = when(anyPass(map(x => test(RegExp(`${x}$`)), ['audio', 'video', 'image'])), x => `${x}:url`)
const putInArray = anyPass(map(x => test(RegExp(x)), ['audio', 'video', 'image']))
const url = require('url')
const c2x = unless(test(/^\/\//), require('css-to-xpath'))

const firstPath = curry((test, paths, data) => reduce((a,p) => a || test(path(p, data)), null, map(split(/\s*\.\s*/g), split(/\s*,\s*/, paths))))

module.exports = options => flatMap(e => {
// .then(unless(x => x.lang, async x =>
//     merge(x, {lang: pathOr('en', ['languages', 0, 'code'], await require('cld').detect(e.toString(), {isHTML: true}).catch(() => {}) )})
// ))
  const meta = {}

  const $ = selector => e.find(c2x(selector))

  const allText = e => {
    if (e.name && contains(e.name(), ['script'])) return ''
    return isEmpty(e.childNodes())
      ? trim(e.text().replace(/\s+/gim,' '))
      : reject(isEmpty, map(allText, e.childNodes()))
  }

  const texts = flatten(allText(e))

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
        meta[k.toLocaleLowerCase()] = isArrayLike(meta[k])
          ? append(content, meta[k])
          : [content]
      } else
        meta[k.toLocaleLowerCase()] = content
    })

  const dates = $('time').map(x =>
    x.attr('datetime')
      ? x.attr('datetime').value()
      : chronoNode.parseDate(x.text(), new Date(''), {forwardDate: true})
  )

  $('link')
    .map(x => {
      const k = join(':', map(x => x.value(), reject(isNil, [x.attr('rel'), x.attr('hreflang')])))
      if (contains(k, ['stylesheet'])) return
      if (x.attr('href')) meta[k] = x.attr('href').value()
    })

  meta['?:pubdate:lastresort'] = head(map(x => x.date(), reject(({tags}) => isEmpty(tags) || tags.ENRelativeDateFormatParser || tags.ENCasualDateParser, chronoNode.parse(texts.join('\n', new Date(), {forwardDate: false}).toString()))))
  if (head(dates)) meta['?:published'] = head(dates)

  meta['html:title'] = isNil(head($('title'))) ? null : head($('title')).text()


  meta.url = firstPath(x => x , 'jsonld:url,og:url', meta)
  meta['?:host'] = propOr('', 'hostname', firstPath(tryCatch(url.parse, () => null), 'url,link:alternate,link:stylesheet', meta)).replace(/^www\./, '')
// ).hostname

  $('script[type="application/ld+json"]').map(e => {
    if (!e.text) return
    let jsonld
    try {
      jsonld = when(is(Array), indexBy(prop('@type')), when(has('@graph'), prop('@graph'), JSON.parse(e.text())))
    } catch (e) {
      console.error(e, e.text())
      return
    }
    if (isEmpty(jsonld)) return
    meta['jsonld:pubdate'] = unless(isNil, x => new Date(x).toISOString(), firstPath(x => x!='0000-00-00T00:00:00Z' && tryCatch(Date, () => null)(x), 'Article.datePublished,WebPage.datePublished,datePublished,dateModified', jsonld))
    meta['jsonld:title'] = firstPath(x => x, 'Article.headline, WebPage.title,headline,title,name', jsonld)
    meta['jsonld:author'] = firstPath(x => x, 'author.name,creator', jsonld)
    meta['jsonld:publisher'] = firstPath(x => x, 'publisher.name', jsonld)
    meta['jsonld:keywords'] = when(is(String), split(','), firstPath(x => x, 'keywords', jsonld))
    meta['jsonld:url'] = firstPath(x => x, 'url,mainEntityOfPage', jsonld)
    meta['jsonld:image'] = firstPath(x => x, 'image', jsonld)
  })

  if (length(meta.publisher) > 100) meta.publisher = null

  const possibleDates = map(x => new Date(x), reject(isNil, props(['article:published_time', 'time:published', 'jsonld:pubdate', 'sailthru.date', 'last-updated','?:published', 'date'], meta)))

  // m.pubdate = head(sortBy(x => Math.abs(mean(possibleDates) - x), possibleDates)) || m['?:pubdate:lastresort']
  meta.thumbs = reject(x => isEmpty(x) || isNil(x), firstPath(x => x, 'og:image:secure_url,og:image,og:image:url,twitter:image,twitter:image:url', meta) || [])
  meta.url = decodeURI(meta.url)
  meta.keywords = firstPath(x=>x, 'jsonld:keywords,keywords', meta)
  meta.title = firstPath(x => x, 'jsonld:title,og:title,twitter:title,html:title', meta)

  meta['?:author'] = head(reject(isNil,$('[itemprop*="author"],[rel="author"],.author').map(x => x.text())))
    || prop(1, match(/^.*?[-|]\s+(.*)$/, meta['html:title']))
    || prop(1, match(/^(.*?)\s[-|]\satom$/i, join(' ' ,$('link[type="xml"]').map(x => x.attr('title')))))

  meta['?:publisher'] = head(reject(isNil, $('[itemprop*="publisher"],[rel="publisher"],.author').map(x => x.text())))

  meta.pubdate = head(sortBy(x => x, possibleDates)) || meta['?:pubdate:lastresort']
  meta.author = firstPath(x => x, 'jsonld:author,author,?:author,og:host,?:host', meta)
  meta.publisher = defaultTo('', firstPath(x => x, 'jsonld:publisher,publisher,og:site_name,application-name,?:host', meta))
    .replace(/,.*/, '')
    .replace(/www\./, '')
    .replace(/https?:/, '')
    .replace(/^\/\//, '')

  return reject(isNil, mapObjIndexed(when(is(String), trim), meta))
})
