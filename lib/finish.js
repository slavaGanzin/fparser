let handlers = []
let threads = 0

const prepareOutput = x => JSON[ARGV.nopretty ? 'stringify' : 'pretty'](x)
const runFinishHandlers = () => map(call, handlers)

const finish = () => {
  debug('fparser:threads:+')(++threads)
  return tap(compose(
    when(() => debug('fparser:threads:-')(--threads) == 0, runFinishHandlers),
    unless(isNil, console.log),
    when(is(Object), prepareOutput),
    headIfOneElement,
    flatten
  ))
}

module.exports = {finish, handlers}
