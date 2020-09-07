// Connect required modules
// Bot's framework
const Telegraf = require('telegraf');
// For parse
const axios = require('axios');
// For pick target element in parsed data
const cheerio = require('cheerio');
// Remove private keys from public file
require('dotenv').config();
// Adding keyboards
const { Router, Markup } = Telegraf;
// For Scenes feature
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
// Function with getting actual day and month for return to user in one of bot's feature
const today = require('./today');

const { enter, leave } = Stage;

// Bot's private key
const bot = new Telegraf(process.env.BOT_TOKEN);

// Keyboards------------------------------------------------------------------

const inlineKeyboardChoiceLang = Markup.inlineKeyboard([
  Markup.callbackButton('English Wiki', 'englishScene'),
  Markup.callbackButton('Русская Wiki', 'russianScene'),
]).extra();

const KeyboardSpecialEn = Markup.keyboard([
  ['Featured article', 'In the news'],
  ['Did you know ...', 'On this day'],
  ["Today's featured picture"],
])
  // For more lower size, than default
  .resize()
  .extra();

const KeyboardSpecial = Markup.keyboard([
  ['Избранная статья', 'Знаете ли вы'],
  ['Хорошая статья', 'Текущие события'],
  ['В этот день', 'Изображение дня'],
])
  .resize()
  .extra();

// First launch bot greeting---------------------------------------------------

bot.start((ctx) =>
  ctx.reply(
    `Здравствуйте ${ctx.message.from.first_name}!
Введите Ваш запрос, чтобы получить краткую выдержку из "Википедии", ссылку на полную статью, а так же на другие возможные значения вашего запроса.
Либо введите команду /help , для получения информации об этом боте, контактной информации и др.

Good day ${ctx.message.from.first_name}!
Send your quastion for getting short discription from Wiki, link on full article and link on other uses your search word
Or just send command /help , for get bot's info, contacts and other`,
    inlineKeyboardChoiceLang
  )
);

// Bot's info command-----------------------------------------------------------

bot.help((ctx) =>
  ctx.reply(
    `Контактная информация для вопросов и предложений - @alexeyinn 
Ссылка на исходный код проекта - https://github.com/alexeyinn/wiki_CallbackSearch_bot
В планах добавить в бота: 
Навигация по разделам искомой статьи прямо внутри бота. 
Сбор статистики по посещаемости.

Contacts, questions and offers - @alexeyinn
Bot on Git-Hub - https://github.com/alexeyinn/wiki_CallbackSearch_bot
And in plans work on:
Navigation through searched article.
Mining bot's trafic
`,
    inlineKeyboardChoiceLang
  )
);

// English language scene------------------------------------------------------

const enLang = new Scene('englishLang');
// Link on wiki's main page
const genEnLink = 'https://en.wikipedia.org/wiki/Main_Page';

// Enter in scene
enLang.enter((ctx) =>
  ctx.reply(
    "You choose an english wiki. Type you query to geting Wili's article, or use bottom buttons for some special queries.",
    KeyboardSpecialEn
  )
);
// Leave scene notification
enLang.leave((ctx) => ctx.reply("You changed wiki's language..."));

// EN special queries
// All function with getting data from web, must use async/await
bot.hears('Featured article', async (ctx) => {
  await axios
    // Axios get data
    .get(genEnLink)
    .then((response) => {
      // Cheerio get data
      const $ = cheerio.load(response.data, { decodeEntities: false });
      // Pick required data from full parsed web page. Slice for valid telegram text size
      ctx.reply($('#mp-tfa').children('p').slice(0).eq(0).text(), KeyboardSpecialEn);
    })
    // Without errors catching, when we got some problem, bot's just stopped on server. No auto-restart available
    .catch((error) => {
      // With this, we can knowed error's description right in bot's inteface
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('In the news', async (ctx) => {
  await axios
    .get(genEnLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#mp-itn').children('ul').text(), KeyboardSpecialEn);
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('Did you know ...', async (ctx) => {
  await axios
    .get(genEnLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#mp-dyk').children('ul').text(), KeyboardSpecialEn);
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('On this day', async (ctx) => {
  await axios
    .get(genEnLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(`${today.ENdayMonth}\n` + $('#mp-otd').children('ul').text(), KeyboardSpecialEn);
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears("Today's featured picture", async (ctx) => {
  await axios
    .get(genEnLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(
        $('#mp-tfp').find('img').attr('src') + '\n' + $('#mp-tfp').find('p').text(),
        KeyboardSpecialEn
      );
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
});

// EN main query

enLang.on('text', async (ctx) => {
  const enWiki = ctx.message.text;
  const enLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(enWiki)}`;
  const enAnotherLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(
    enWiki
  )}_(disambiguation)`;

  ctx.reply(`For other uses - ${enAnotherLink}`);
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
          // RegExp for removing text's links from result. etc [5]
          .replace(/(\[\S+\])+/g, ''),
        KeyboardSpecialEn
      );
    })

    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
      ctx.reply(
        "Check your query. Maybe problem just in grammar, or type /switch to change Wiki's language"
      );
    });
});

// Russian language scene-------------------------------------------------------

const ruLang = new Scene('russianLang');
const genRuLink =
  'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0';

ruLang.enter((ctx) =>
  ctx.reply(
    'Вы выбрали русский язык. Введите ваш запрос, что бы найти необходимую статью из вики, лиюл используейте кнопки снизу, для запросов спецаильного назначения.',
    KeyboardSpecial
  )
);
ruLang.leave((ctx) => ctx.reply('Вы сменили язык...'));

// RU special queries
bot.hears('Избранная статья', async (ctx) => {
  await axios
    .get(genRuLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#main-tfa').children('p').slice(0).eq(0).text(), KeyboardSpecial);
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('Знаете ли вы', async (ctx) => {
  await axios
    .get(genRuLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#main-dyk').children('ul').text(), KeyboardSpecial);
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('Хорошая статья', async (ctx) => {
  await axios
    .get(genRuLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#main-tga').children('p').slice(0).eq(0).text(), KeyboardSpecial);
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('Текущие события', async (ctx) => {
  await axios
    .get(genRuLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(
        $('#main-cur').find('dl').text() +
          '\n ...а так же... \n' +
          $('#main-cur').children('ul').text(),
        KeyboardSpecial
      );
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('В этот день', async (ctx) => {
  await axios
    .get(genRuLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(`${today.dayMonth}\n` + $('#main-itd').children('ul').text(), KeyboardSpecial);
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
});

bot.hears('Изображение дня', async (ctx) => {
  await axios
    .get(genRuLink)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#main-potd').find('img').attr('src'), KeyboardSpecial);
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
});

// Main RU query

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
          .replace(/(\[\S+\])+/g, ''),
        KeyboardSpecial
      );
    })

    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
      ctx.reply(
        'Проверьте написание запроса. Возможно, вы допустили грамматическую ошибку. Либо введите /switch для изменения версии локализации Wiki'
      );
    });
});

bot.command('switch', (ctx) =>
  ctx.reply("Choose Wiki's language / Выберите язык Wiki", inlineKeyboardChoiceLang)
);

// For scenes
const stage = new Stage([ruLang, enLang]);
bot.use(session());
bot.use(stage.middleware());
bot.action('russianScene', (ctx) => ctx.scene.enter('russianLang'));
bot.action('englishScene', (ctx) => ctx.scene.enter('englishLang'));

bot.launch();
