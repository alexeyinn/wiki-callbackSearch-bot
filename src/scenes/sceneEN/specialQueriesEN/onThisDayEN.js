const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialEN = require('../../keyboards/keyboardSpecialEN');
const today = require('../../../today');

const genLinkEN = 'https://en.wikipedia.org/wiki/Main_Page';

const onThisDayEN = async (ctx) => {
  await axios
    .get(genLinkEN)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(`${today.ENdayMonth}\n` + $('#mp-otd').children('ul').text(), keyboardSpecialEN);
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
};

module.exports = onThisDayEN;
