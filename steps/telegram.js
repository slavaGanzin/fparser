const PH = require('../lib/placeholders')

module.exports = options => {
  const bot = new (require('telegraf'))(options.token)

  return flatMap(x => {
    const f = () => bot.telegram.sendMessage(options.chatId, PH.apply(x)(options.message), {parse_mode: 'Markdown'})
      .catch(e => {
        if (e.code == 429) setTimeout(f, Math.random()*5000)
        else console.log(e)
      })

    return f()
  })
}
