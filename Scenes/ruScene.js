const Telegraf = require('telegraf');
const Scene = require('telegraf/scenes/base');
const { Extra, Markup, Stage, session } = Telegraf;

const { enter, leave } = Stage;

class SceneGenerator {
  GenRuLangScene() {
    const ru = new Scene('russianLang');
    ru.enter((ctx) =>
      ctx.reply(
        'Вы выбрали русский язык. Введите ваш запрос, что бы найти необходимую статью из вики'
      )
    );
    ru.leave((ctx) => ctx.reply('Вы сменили язык...'));
    ru.on('text', async (ctx) => {
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
              .replace(/(\[\S+\])+/g, '')
          );
        })

        .catch((error) => {
          ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
          ctx.reply('Проверьте написание запроса. Возможно, вы допустили грамматическую ошибку.');
        });
    });
  }
}

module.exports = SceneGenerator;
