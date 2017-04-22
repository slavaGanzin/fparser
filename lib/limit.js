const LIMIT_TIMEOUT = 100
const NIL = 0

module.exports = (lim, i = NIL) => f =>
  new Promise((resolve, reject) => {
    const _limit = () => i < parseInt(lim)
      ? tap(debug('limit'), ++i)
        && f()
          .then(tap(() => debug('limit')(--i)))
          .then(resolve)
          .catch(reject)
      : setTimeout(_limit, LIMIT_TIMEOUT)

    _limit()
  })
