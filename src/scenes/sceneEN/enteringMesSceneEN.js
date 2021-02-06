const keyboardSpecialEN = require('../keyboards/keyboardSpecialEN');

const enteringMesSceneEN = (ctx) =>
  ctx.reply(
    "You choose an english wiki. Type you query to geting Wili's article, or use bottom buttons for some special queries.",
    keyboardSpecialEN
  );

module.exports = enteringMesSceneEN;
