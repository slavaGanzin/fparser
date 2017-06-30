const HeadlessChrome = require('simple-headless-chrome')

const browser = new HeadlessChrome({
  headless: true, // If you turn this off, you can actually see the browser navigate with your instructions
 // see above if using remote interface
})

module.exports = steps => flatMap(
  composeP(
    mapObjIndexed(
      (arg, step) => browser[step](),
      // (arg, step) => console.log(step, ...arg.split(',')),
    steps)
  )
)

// async function navigateWebsite() {
//   await browser.init()
//   // Navigate to a URL
//   await browser.goTo('http://www.mywebsite.com/login')
//
//   // Fill an element
//   await browser.fill('#username', 'myUser')
//
//   // Type in an element
//   await browser.type('#password', 'Yey!ImAPassword!')
//
//   // Click on a button
//   await browser.click('#Login')
//
//   // Log some info in your console
//   await browser.log('Click login')
//
//   // Wait some time! (2s)
//   await browser.wait(2000)
//
//   // Log some info in your console, ONLY if you started the app in DEBUG mode (DEBUG='HeadlessChrome*' npm start)
//   await browser.debugLog('Waiting 5 seconds to give some time to all the redirects')
//
//   // Navigate a little...
//   await browser.goTo('http://www.mywebsite.com/myProfile')
//
//   // Check the select current value
//   const myCurrentSubscriptionPlan = await browser.getValue('#subscriptionSelect')
//   console.log(myCurrentSubscriptionPlan) // {type: 'string', value: '1 month' }
//
//   // Edit the subscription
//   await browser.select('#subscriptionSelect', '3 months')
//   await browser.click('#Save')
//
//   // Take a screenshot
//   await browser.saveScreenshot('./shc.png')
//
//   // Get a HTML tag value based on class id
//   const htmlTag = await browser.evaluate(function(selector) {
//     const selectorHtml = document.querySelector(selector)
//     return selectorHtml.innerHTML
//   }, '.main'); // returns innerHTML of first matching selector for class "main"
//
//   // Close the browser
//   await browser.close()
//  }
//  navigateWebsite().then(console.log).catch(console.log)
