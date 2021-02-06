const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialEN = require('../../keyboards/keyboardSpecialEN');

const genLinkEN = 'https://en.wikipedia.org/wiki/Main_Page';

const didYouKnowEN = async (ctx) => {
  await axios
    .get(genLinkEN)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply($('#mp-dyk').children('ul').text(), keyboardSpecialEN);
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
};

module.exports = didYouKnowEN;
