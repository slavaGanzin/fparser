const replacer = (v,k) =>
unless(either(is(Number), is(Boolean)),
  compose(replace('$'+k,v), String)
)

const _apply = ifElse(is(Object),
compose(
  apply(compose),
  values,
  mapObjIndexed(replacer)
),
always(identity))

const selfApply = placeholders => {
  let _mem

  while(! equals(_mem , placeholders)) {
    _mem = placeholders
    debug('fparser:placeholders')(_mem)
    mapObjIndexed((v,k) =>
      placeholders = map(replacer(v,k), placeholders), placeholders)
  }
  return placeholders
}

const _merge = placeholders => evolve({
  placeholders: compose(selfApply, merge(__, placeholders))
})

module.exports = { apply: _apply, selfApply, merge: _merge }
