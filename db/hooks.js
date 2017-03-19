const hooks = {
  pre: {
    json:       () => JSON.stringify,
    jsonPretty: () => JSON.pretty,
    none:       () => identity,
    prop,
  },
  post: {
    none:       () => identity,
    json:       () => JSON.parse,
    jsonPretty: () => JSON.parse,
    prop,
  },
}

const prepareHook = hook =>
  compose(
    apply(compose),
    map(compose(
      ([, f, args]) => hooks[hook][f](...split(',', args)),
      match(/(\w+)\(?([^)]*)/)
    )))

module.exports = {
  pre:  prepareHook('pre'),
  post: prepareHook('post'),
}
