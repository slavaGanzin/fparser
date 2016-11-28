module.exports = ([r, s, f='gim']) => map(replace(new RegExp(r, f), s))
