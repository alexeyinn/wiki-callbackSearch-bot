const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialRU = require('../../keyboards/keyboardSpecialRU');
const today = require('../../../today');

const genLinkRU =
  'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0';

const onThisDayRU = async (ctx) => {
  await axios
    .get(genLinkRU)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(`${today.dayMonth}\n` + $('#main-itd').children('ul').text(), keyboardSpecialRU);
    })
    .catch((error) => {
      ctx.reply(`Ошибка ${error.name}:${error.message}\n${error.stack}`);
    });
};

module.exports = onThisDayRU;
