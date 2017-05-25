let handlers = []
const EMPTY = 0
let threads = EMPTY

const prepareOutput = x => JSON[ARGV.nopretty ? 'stringify' : 'pretty'](x)
const runFinishHandlers = () => map(call, handlers)

const finish = () => {
  debug('fparser:threads:+')(++threads)
  return tap(compose(
    when(() => debug('fparser:threads:-')(--threads) == EMPTY, runFinishHandlers),
    unless(isNil, console.log),
    when(is(Object), prepareOutput),
    headIfOneElement,
    flatten
  ))
}

module.exports = {finish, handlers}
