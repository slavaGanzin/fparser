let handlers = []
const EMPTY = 0
let threads = EMPTY

const runFinishHandlers = () => map(call, handlers)

const finish = () => {
  debug('fparser:threads:+')(++threads)
  return tap(compose(
    when(() => debug('fparser:threads:-')(--threads) == EMPTY, runFinishHandlers),
    console.log,
    ARGV.json ? x => JSON.stringify(x, null, ' ') : identity,
    headIfOneElement,
    flatten
  ))
}

module.exports = {finish, handlers}
