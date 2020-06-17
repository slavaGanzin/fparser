const init = options => {
  process.env.DEBUG = `${options.debug},${process.env.DEBUG}`
  const puppeteer = require('puppeteer')

  return puppeteer.launch(options)
  .then(b => global.browser = b)
  .then(tap(() => browser.pages().then(([x]) => x.close())))
  .catch(console.error)
  //yay -S libxi libxtst atk at-spi2-atk  libcups libxss xrandr libdrm mesa alsa-lib pango gtk3
}

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length;

    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    // console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitFor(checkDurationMsecs);
  }
}

const get = options =>
  init(options.puppeteer)
  .then(() =>
    global.browser.newPage()
      .then(page =>
        page
        .goto(options.url, options.puppeteer.goto)
        .then(() => waitTillHTMLRendered(page))
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
