const read = thenify("node-readability")

module.exports = options => flatMap(composeP(([article, meta]) =>
`<html><head><meta charset="utf-8"><title>${article.document.title}</title></head>
<body><h1>${article.title}</h1>${article.content}</body></html>`
, read))
