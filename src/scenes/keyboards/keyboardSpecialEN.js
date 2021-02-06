const Telegraf = require('telegraf');
const { Markup } = Telegraf;

const keyboardSpecialEN = Markup.keyboard([
  ['Featured article', 'In the news'],
  ['Did you know ...', 'On this day'],
  ["Today's featured picture"]
])
  // For more lower size, than default
  .resize()
  .extra();

module.exports = keyboardSpecialEN;
