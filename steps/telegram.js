const PH = require('../lib/placeholders')

module.exports = options => {
  const bot = new (require('telegraf'))(options.token)

  return flatMap(x =>
    bot.telegram.sendMessage(options.chatId, PH.apply(x)(options.message), {parse_mode: 'Markdown'})
      .catch(console.error)
  )
}
