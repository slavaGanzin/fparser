//TODO: https://github.com/wanasit/chrono
const appendURL = when(anyPass(map(x => test(RegExp(`${x}$`)), ['audio', 'video', 'image'])), x => `${x}:url`)
const putInArray = anyPass(map(x => test(RegExp(x)), ['audio', 'video', 'image', 'article:tag', 'tag', 'keywords', 'article:section']))
const url = require('url')
const c2x = unless(test(/^\/\//), require('css-to-xpath'))

const firstPath = curry((test, paths, data) =>
  reduce((a,p) => a || test(path(p, data)) && path(p, data), null, map(split(/\s*\.\s*/g), split(/\s*,\s*/, paths))))

const notSocial = complement(test(/facebook|twitter|wordpress|google/))

module.exports = options => flatMap(async e => {
  const meta = {}

  const $ = selector => e.find(c2x(selector))

  meta['?:host'] = propOr(options.url, 'hostname', firstPath(tryCatch(url.parse, () => null), 'url,link:alternate,link:stylesheet,cannonical', meta)).replace(/^www\./, '')
  meta['?:title'] = isNil(head($('title'))) ? null : head($('title')).text()
  meta['?:author'] = head(reject(isNil, $('[itemprop*="author"],[rel="author"],.author').map(x => x.text())))
    || prop(1, match(/^(.*?)\s[-|]\satom$/i, join(' ' ,$('link[type="xml"]').map(x => x.attr('title')))))

  meta['?:publisher'] = head(reject(isNil, $('[itemprop*="publisher"],[rel="publisher"],.author').map(x => x.text())))
    || prop(1, match(/^.*?[-|]\s+(.*)$/, meta['?:title']))

  const allText = e => {
    if (e.name && contains(e.name(), ['script', 'style'])) return ''
    return isEmpty(e.childNodes())
      ? trim(e.text().replace(/\s+/gim,' '))
      : reject(isEmpty, map(allText, e.childNodes()))
  }

  const texts = flatten(allText(e))

  meta.lang = pathOr('en', ['languages', 0, 'code'], await require('cld').detect(texts.join('\n')).catch(() => {}) )

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

  meta['?:pubdate:lastresort'] = head(map(x => x.date(), reject(({tags}) => isEmpty(tags) || tags.ENRelativeDateFormatParser || tags.ENCasualDateParser, chronoNode.parse(texts.join('\n', new Date(), {forwardDate: false}).toString()))))

  if (head(dates)) meta['?:published'] = head(dates)
  $('link')
    .map(x => {
      const k = join(':', map(x => x.value(), reject(isNil, [x.attr('rel'), x.attr('hreflang')])))
      if (contains(k, ['stylesheet'])) return
      if (x.attr('href')) meta[k] = x.attr('href').value()
    })




  meta.url = firstPath(x => x , 'jsonld:url,og:url', meta)
// ).hostname

  $('script[type="application/ld+json"]').map(e => {
    if (!e.text) return
    let jsonld
    try {
      jsonld = when(is(Array), indexBy(prop('@type')), when(has('@graph'), prop('@graph'), JSON.parse(e.text())))
    } catch (error) {
      pe({error, text: e.text()})
      return
    }
    if (isEmpty(jsonld)) return
    meta['jsonld:pubdate'] = unless(isNil, x => new Date(x).toISOString(), firstPath(x => x!='0000-00-00T00:00:00Z' && tryCatch(Date, () => null)(x), 'Article.datePublished,WebPage.datePublished,datePublished,dateModified', jsonld))
    meta['jsonld:title'] = firstPath(x => x, 'Article.headline, WebPage.title,headline,title,name', jsonld)
    meta['jsonld:author'] = firstPath(x => x, 'author.name,creator', jsonld)
    meta['jsonld:publisher'] = firstPath(x => x, 'publisher.name', jsonld)

    const mediumHack = when(find(test(/Tag:/)), compose(uniq, map(replace(/.*:([^:]+)/gim, '$1')), filter(test(/Tag:|Topic:/gim))))
    meta['jsonld:keywords'] = mediumHack(defaultTo([], when(is(String), split(/\s*,\s*/), firstPath(x => x, 'keywords', jsonld))))
    meta['jsonld:url'] = firstPath(x => x, 'url,mainEntityOfPage', jsonld)
    meta['jsonld:image'] = coerceArray(firstPath(x => x, 'image.url,image', jsonld))
  })

  const possibleDates = map(x => new Date(x), reject(isNil, props(['article:published_time', 'time:published', 'jsonld:pubdate', 'sailthru.date', 'last-updated','?:published', 'date'], meta)))

  // m.pubdate = head(sortBy(x => Math.abs(mean(possibleDates) - x), possibleDates)) || m['?:pubdate:lastresort']
  const notEmpty = complement(isEmpty)
  meta.thumbs = reject(x => isEmpty(x) || isNil(x), firstPath(x => x, 'og:image:secure_url,og:image,og:image:url,twitter:image,twitter:image:url,jsonld:image', meta) || [])
  meta.url = decodeURI(meta.url)
  meta.keywords = map(toTitleCase, flatten(map(split(/\s*,\s*/), reject(isNil, coerceArray(firstPath(notEmpty, 'jsonld:keywords,article:tag,article:section,keywords', meta))))))
  meta.title = firstPath(x => x, 'jsonld:title,og:title,twitter:title,?:title', meta)



  meta.pubdate = head(sortBy(x => x, possibleDates)) || meta['?:pubdate:lastresort']
  meta.publisher = (firstPath(both(notEmpty, notSocial), 'jsonld:publisher,article:publisher,publisher,?:publisher,og:site_name,application-name,?:host', meta) || '')
    .replace(/,.*/, '')
    .replace(/www\./, '')
    .replace(/https?:/, '')
    .replace(/^\/\//, '')

  meta.author = firstPath(both(notEmpty, notSocial), 'jsonld:author,article:author,author,twitter:data1,?:author,publisher,?:publisher, og:host,?:host', meta)
  meta.publisher = meta.publisher || meta.author

  return mapObjIndexed(when(is(String), trim), meta)
})
