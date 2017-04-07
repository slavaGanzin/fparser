const promiseRejected = reason => {
  throw reason
}

const ERROR = 127

process.on('uncaughtException', x => {
  console.error(x)
  process.exit(ERROR)
})
process.on('unhandledRejection', promiseRejected)
process.on('rejectionHandled', promiseRejected)
