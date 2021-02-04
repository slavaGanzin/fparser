let handlers = []
const EMPTY = 0
let threads = EMPTY

const runFinishHandlers = () => map(call, handlers)

const finish = () => {
  debug('fparser:threads:+')(++threads)
  return tap(compose(
    when(() => debug('fparser:threads:-')(--threads) == EMPTY, runFinishHandlers),
    x => process.stdout.write(x),
    ARGV.json ? x => JSON.stringify(x, null, ' ') : prettyjson.render,
    headIfOneElement,
    flatten
  ))
}

module.exports = {finish, handlers}
