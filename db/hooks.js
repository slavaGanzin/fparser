const hooks = {
  pre: {
    json: JSON.stringify,
    jsonPretty: JSON.pretty,
    none: identity
  },
  post: {
    none: identity,
    json: JSON.parse,
    jsonPretty: JSON.parse
  }
}

module.exports = {
  pre: pre => hooks.pre[pre],
  post: post => hooks.post[post]
}
