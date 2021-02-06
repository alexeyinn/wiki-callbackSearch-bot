const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialEN = require('../../keyboards/keyboardSpecialEN');

const genLinkEN = 'https://en.wikipedia.org/wiki/Main_Page';

const dayPictureEN = async (ctx) => {
  await axios
    .get(genLinkEN)
    .then((response) => {
      const $ = cheerio.load(response.data, { decodeEntities: false });
      ctx.reply(
        $('#mp-tfp').find('img').attr('src') + '\n' + $('#mp-tfp').find('p').text(),
        keyboardSpecialEN
      );
    })
    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
};

module.exports = dayPictureEN;
