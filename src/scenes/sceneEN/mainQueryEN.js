const axios = require('axios');
const cheerio = require('cheerio');

const keyboardSpecialEN = require('../keyboards/keyboardSpecialEN');

const mainQueryEN = async (ctx) => {
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
          .children("p:contains('.')")
          .slice(0)
          .eq(0)
          .text()
          // RegExp for removing text's links from result. etc [5]
          .replace(/(\[\S+\])+/g, ''),
        keyboardSpecialEN
      );
    })

    .catch((error) => {
      ctx.reply(`Error ${error.name}:${error.message}\n${error.stack}`);
      ctx.reply(
        "Check your query. Maybe problem just in grammar.\nPerson's first name and last name, first char, must by writen in Upperсase\n Or type /switch to change Wiki's language"
      );
    });
};

module.exports = mainQueryEN;
