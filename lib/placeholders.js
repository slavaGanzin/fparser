const replacer = (v, k) =>
  unless(either(is(Number), is(Boolean)),
    compose(replace(`$${k}`, v), String)
  )

const _apply = ifElse(is(Object),
  compose(
    apply(compose),
    values,
    mapObjIndexed(replacer)
  ),
  always(identity))

const selfApply = (placeholders, _mem = null) => {
  while (!equals(_mem, placeholders)) {
    _mem = placeholders
    debug('fparser:placeholders')(_mem)
    mapObjIndexed((v, k) => {
      placeholders = map(replacer(v, k), placeholders)
    }, placeholders)
  }
  return placeholders
}

const _merge = placeholders => evolve({
  placeholders: compose(selfApply, merge(__, placeholders)),
})

const KEY = 0
const ONE = 1

const parse = compose(
  fromPairs,
  map(compose(
    adjust(x => `$${x}`, KEY),
    reject(isEmpty),
    split(/(\w+)="?(\S+)"?\s?/g)
  )),
  dropLast(ONE)
)


module.exports = {apply: _apply,
  selfApply,
  merge: _merge,
  parse}
