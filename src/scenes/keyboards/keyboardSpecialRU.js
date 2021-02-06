const Telegraf = require('telegraf');
const { Markup } = Telegraf;

const keyboardSpecialRU = Markup.keyboard([
  ['Избранная статья', 'Знаете ли вы'],
  ['Хорошая статья', 'Текущие события'],
  ['В этот день', 'Изображение дня']
])
  .resize()
  .extra();

module.exports = keyboardSpecialRU;
