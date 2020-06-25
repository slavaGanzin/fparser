let handlers = []
const EMPTY = 0
let threads = EMPTY

const runFinishHandlers = () => map(call, handlers)

const finish = () => {
  debug('fparser:threads:+')(++threads)
  return tap(compose(
    when(() => debug('fparser:threads:-')(--threads) == EMPTY, runFinishHandlers),
    ARGV.json ? compose(console.log,JSON.stringify) : pp,
    headIfOneElement,
    flatten
  ))
}

module.exports = {finish, handlers}
