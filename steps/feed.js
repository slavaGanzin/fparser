const FeedParser = require('feedparser')

module.exports = options => {
  const feed = new FeedParser(options)

  return flatMap(xml => new Promise((resolve, reject, items = []) => {
    feed
      .on('error', reject)
      .on('readable', function () {
        while (item = this.read())
          items.push(item)
      })
      .on('end', () => resolve(items))
      .write(xml)
    feed.end()
  }))
}
