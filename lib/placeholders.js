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
    }, merge(placeholders, process.env))
  }
  return placeholders
}

const ONE = 1

const parse = compose(
  fromPairs,
  map(compose(
    reject(isEmpty),
    split(/(\w+)="?'?([^=]+)"?'?/g)
  )),
  dropLast(ONE)
)
const arrayToObject = compose(fromPairs, values, mapObjIndexed((v, k) => [++k, v]))
const cutIndexPlaceholders = pickBy((v, k) => Number(k) != k)

const ofIfPrimitive = unless(is(Object), x => [x])

const pipeline = curry((options, placeholders) =>
  pipe(
    debug('fparser:in'),
    ofIfPrimitive,
    when(is(Array), arrayToObject),
    merge(options.placeholders),
    selfApply,
    objOf('placeholders'),
    merge(options),
    config => deepmap(_apply(config.placeholders))(config),
    debug('fparser:config:post')
  )(placeholders)
)

module.exports = {
  pipeline,
  apply: _apply,
  selfApply,
  parse,
  arrayToObject,
  cutIndexPlaceholders,
}
