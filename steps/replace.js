regex = r => new RegExp(split('/', r)[1], split('/', r)[2])
module.exports = ([r, s]) => map(replace(regex(r), s))
