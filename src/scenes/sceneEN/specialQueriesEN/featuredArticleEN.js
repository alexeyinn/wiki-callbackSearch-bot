const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialEN = require('../../keyboards/keyboardSpecialEN');

const genLinkEN = 'https://en.wikipedia.org/wiki/Main_Page';

const featuredArticleEN = async (ctx) => {
  await axios
    // Axios get data
    .get(genLinkEN)
    .then((response) => {
      // Cheerio get data
      const $ = cheerio.load(response.data, { decodeEntities: false });
      // Pick required data from full parsed web page. Slice for valid telegram text size
      ctx.reply($('#mp-tfa').children('p').slice(0).eq(0).text(), keyboardSpecialEN);
    })
    // Without errors catching, when we got some problem, bot's just stopped on server. No auto-restart available
    .catch((error) => {
      // With this, we can knowed error's description right in bot's inteface
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
    });
};

module.exports = featuredArticleEN;
