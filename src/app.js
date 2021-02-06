const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
// Remove private keys from public file
require('dotenv').config();
// Adding keyboards
const { Markup } = Telegraf;

// Bot's private key
const bot = new Telegraf(process.env.BOT_TOKEN);

const welcomeMessage = require('./infoMessages/welcomeMessage');
const contacts = require('./infoMessages/contacts');
const langChoose = require('./infoMessages/langChoose');

const enteringMesSceneEN = require('./scenes/sceneEN/enteringMesSceneEN');
const {
  featuredArticleEN,
  inTheNewsEN,
  didYouKnowEN,
  onThisDayEN,
  dayPictureEN
} = require('./scenes/sceneEN/specialQueriesEN');
const mainQueryEN = require('./scenes/sceneEN/mainQueryEN');

const enteringMesSceneRU = require('./scenes/sceneRU/enteringMesSceneRU');
const {
  featuredArticleRU,
  inTheNewsRU,
  didYouKnowRU,
  onThisDayRU,
  dayPictureRU,
  goodArticleRU
} = require('./scenes/sceneRU/specialQueriesRU');
const mainQueryRU = require('./scenes/sceneRU/mainQueryRU');

// Keyboard

const inlineKeyboardChoiceLang = Markup.inlineKeyboard([
  Markup.callbackButton('English Wiki', 'englishScene'),
  Markup.callbackButton('Русская Wiki', 'russianScene')
]).extra();

// First launch bot greeting
bot.start((ctx) => ctx.reply(`${welcomeMessage(ctx)}`, inlineKeyboardChoiceLang));

// Bot's info command
bot.help((ctx) => ctx.reply(contacts, inlineKeyboardChoiceLang));

// English language scene------------------------------------------------------

const enLang = new Scene('englishLang');

// Enter in scene
enLang.enter(enteringMesSceneEN);
// Leave scene notification
enLang.leave((ctx) => ctx.reply("You changed wiki's language..."));
// EN special queries
bot.hears('Featured article', featuredArticleEN);
bot.hears('In the news', inTheNewsEN);
bot.hears('Did you know ...', didYouKnowEN);
bot.hears('On this day', onThisDayEN);
bot.hears("Today's featured picture", dayPictureEN);

// EN main query
enLang.on('text', mainQueryEN);

// Russian language scene-------------------------------------------------------

const ruLang = new Scene('russianLang');

ruLang.enter(enteringMesSceneRU);
ruLang.leave((ctx) => ctx.reply('Вы сменили язык...'));

// RU special queries
bot.hears('Избранная статья', featuredArticleRU);
bot.hears('Знаете ли вы', didYouKnowRU);
bot.hears('Хорошая статья', goodArticleRU);
bot.hears('Текущие события', inTheNewsRU);
bot.hears('В этот день', onThisDayRU);
bot.hears('Изображение дня', dayPictureRU);

// Main RU query
ruLang.on('text', mainQueryRU);

bot.command('switch', langChoose);

// For scenes
const stage = new Stage([ruLang, enLang]);
bot.use(session());
bot.use(stage.middleware());
bot.action('russianScene', (ctx) => ctx.scene.enter('russianLang'));
bot.action('englishScene', (ctx) => ctx.scene.enter('englishLang'));

bot.launch();

module.exports = inlineKeyboardChoiceLang;
