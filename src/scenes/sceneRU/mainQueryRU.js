const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialRU = require('../keyboards/keyboardSpecialRU');

const mainQueryRU = async (ctx) => {
  const wiki = ctx.message.text;
  const link = `https://ru.wikipedia.org/wiki/${encodeURIComponent(wiki)}`;
  const anotherLink = `https://ru.wikipedia.org/wiki/${encodeURIComponent(
    wiki
  )}_(%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D1%8F)`;

  ctx.reply(`Посмотреть другие значения слова - ${anotherLink}`);
  ctx.reply(`Посмотреть статью полностью - ${link}`);

  await axios
    .get(link)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });

      ctx.reply(
        $('.mw-parser-output')
          .children('p')
          .slice(0)
          .eq(0)
          .text()
          .replace(/(\[\S+\])+/g, ''),
        keyboardSpecialRU
      );
    })

    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
      ctx.reply(
        'Проверьте написание запроса. Возможно, вы допустили грамматическую ошибку.\n(Имена и фамилии людей нужно вводить с большой буквы. Большими буквами весь запрос - писать нельзя)\nЛибо введите /switch для изменения версии локализации Wiki.'
      );
    });
};

module.exports = mainQueryRU;
