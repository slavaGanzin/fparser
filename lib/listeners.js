const promiseRejected = reason => {
  console.log(reason)
  throw reason
}

const ERROR = 127

process.on('uncaughtException', x => {
  console.log(x)
  process.exit(ERROR)
})
process.on('unhandledRejection', promiseRejected)
process.on('rejectionHandled', promiseRejected)
