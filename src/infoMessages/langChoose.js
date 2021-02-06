const inlineKeyboardChoiceLang = require('../app');

const langChoose = (ctx) =>
  ctx.reply("Choose Wiki's language / Выберите язык Wiki", inlineKeyboardChoiceLang);

module.exports = langChoose;
