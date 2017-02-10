// require('pretty-error').start()

const promiseRejected = (reason, promise) => {
  throw reason
}
  
process.on('uncaughtException', x =>  {
  console.error(x)
  process.exit(127)
})
process.on('unhandledRejection', promiseRejected)
process.on('rejectionHandled', promiseRejected)
