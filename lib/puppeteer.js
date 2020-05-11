

const init = options => {
  process.env.DEBUG = `${options.debug},${process.env.DEBUG}`
  const puppeteer = require('puppeteer')

  return puppeteer.launch(options)
  .then(b => global.browser = b)
  .then(tap(() => browser.pages().then(([x]) => x.close())))
}

const get = options =>
  init(options.puppeteer)
  .then(() =>
    global.browser.newPage()
      .then(page =>
        page.goto(options.url, options.puppeteer.goto)
        .then(() => page.content()
        .then(body => {
          page.close()
          return {
            body,
            statusCode: 200,
            headers: {
            'content-type': 'html'
          }
        }
      }))))

module.exports = {get}
