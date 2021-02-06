const keyboardSpecialRU = require('../keyboards/keyboardSpecialRU');

const enteringMesSceneRU = (ctx) =>
  ctx.reply(
    'Вы выбрали русский язык. Введите ваш запрос, что бы найти необходимую статью из вики, либо используейте кнопки снизу, для запросов спецаильного назначения.',
    keyboardSpecialRU
  );

module.exports = enteringMesSceneRU;
