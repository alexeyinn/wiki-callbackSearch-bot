const Telegraf = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(`Здравствуйте ${ctx.message.from.first_name}!
Введите Ваш вопрос, чтобы получить краткую выдержку из "Википедии", ссылку на полную статью, а так же на другие возможные значения вашего запроса.
Либо введите команду /help , для получения информации об этом боте, контактной информации и др.

Good day ${ctx.message.from.first_name}!
Work on English version in progress`)
);

bot.help((ctx) =>
  ctx.reply(`Контактная информация для вопросов и предложений - @alexeyinn 
Ссылка на исходный код проекта - https://github.com/alexeyinn/wiki_CallbackSearch_bot
В планах добавить в бота: 
Переключение между языками в рамках одного бота. 
Навигация по разделам искомой статьи прямо внутри бота. 
Сбор статистики по посещаемости.
Получение "статей дня", "текущих событий" и тп.
`)
);

bot.on('text', async (ctx) => {
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

bot.launch();
