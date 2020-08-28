const Telegraf = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const { Router, Markup } = Telegraf;
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

const { enter, leave } = Stage;

const bot = new Telegraf(process.env.BOT_TOKEN);

const inlineKeyboardChoiceLang = Markup.inlineKeyboard([
  Markup.callbackButton('Русская Wiki', 'russianScene'),
  Markup.callbackButton('English Wiki', 'englishScene'),
]).extra();

bot.start((ctx) =>
  ctx.reply(
    `Здравствуйте ${ctx.message.from.first_name}!
Введите Ваш вопрос, чтобы получить краткую выдержку из "Википедии", ссылку на полную статью, а так же на другие возможные значения вашего запроса.
Либо введите команду /help , для получения информации об этом боте, контактной информации и др.

Good day ${ctx.message.from.first_name}!
Work on English version in progress`,
    inlineKeyboardChoiceLang
  )
);

bot.help((ctx) =>
  ctx.reply(
    `Контактная информация для вопросов и предложений - @alexeyinn 
Ссылка на исходный код проекта - https://github.com/alexeyinn/wiki_CallbackSearch_bot
В планах добавить в бота: 
Переключение между языками в рамках одного бота. 
Навигация по разделам искомой статьи прямо внутри бота. 
Сбор статистики по посещаемости.
Получение "статей дня", "текущих событий" и тп.
`,
    inlineKeyboardChoiceLang
  )
);

const ruLang = new Scene('russianLang');
ruLang.enter((ctx) =>
  ctx.reply('Вы выбрали русский язык. Введите ваш запрос, что бы найти необходимую статью из вики')
);
ruLang.leave((ctx) => ctx.reply('Вы сменили язык...'));
ruLang.on('text', async (ctx) => {
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

const enLang = new Scene('englishLang');
enLang.enter((ctx) =>
  ctx.reply('You choice an english wiki. Type you quore for get information from enciclopedia')
);
enLang.leave((ctx) => ctx.reply('You changed language version wiki...'));
enLang.command('russian', leave());
enLang.on('text', async (ctx) => {
  const enWiki = ctx.message.text;
  const enLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(enWiki)}`;
  const enAnotherLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(
    enWiki
  )}_(disambiguation)`;

  ctx.reply(`For othew uses - ${enAnotherLink}`);
  ctx.reply(`Get a full information - ${enLink}`);

  await axios
    .get(enLink)
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
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
      ctx.reply('Check your quore. Maybe problem just in grammer');
    });
});

const stage = new Stage([ruLang, enLang]);
bot.use(session());
bot.use(stage.middleware());
bot.action('russianScene', (ctx) => ctx.scene.enter('russianLang'));
bot.action('englishScene', (ctx) => ctx.scene.enter('englishLang'));
//ruLang.command('russian', (ctx) => ctx.scene.enter('russianLang'));
bot.command('modern', ({ reply }) => reply('Yo'));
//telegram.action('englishScene', (ctx) => /* здесь должен быть вход для сцены */ )
//bot.command('echo', (ctx) => ctx.scene.enter('echo'))
//bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))

bot.launch();
